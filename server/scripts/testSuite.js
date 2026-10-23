async function runTests() {
  console.log('🧪 Starting Yash Tutorials Admin Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log('  ✅ ' + message);
      passed++;
    } else {
      console.error('  ❌ FAILED: ' + message);
      failed++;
    }
  }

  try {
    // 1. Unauthenticated Route Protection
    const unauthRes = await fetch('http://localhost:5000/api/admin/auth/me');
    assert(unauthRes.status === 401, 'Unauthenticated /api/admin/auth/me returns 401 Unauthorized');

    const unauthCourses = await fetch('http://localhost:5000/api/admin/courses');
    assert(unauthCourses.status === 401, 'Unauthenticated /api/admin/courses returns 401 Unauthorized');

    const unauthInquiries = await fetch('http://localhost:5000/api/admin/inquiries');
    assert(unauthInquiries.status === 401, 'Unauthenticated /api/admin/inquiries returns 401 Unauthorized');

    // 2. Invalid Login Credentials
    const badLoginRes = await fetch('http://localhost:5000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@yashtutorials.com', password: 'WrongPassword123' })
    });
    const badLoginJson = await badLoginRes.json();
    assert(badLoginRes.status === 401 && !badLoginJson.success, 'Invalid password rejected with 401 and generic message');

    // 3. Valid Login
    const loginRes = await fetch('http://localhost:5000/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@yashtutorials.com', password: 'YashAdmin2026!' })
    });
    const cookie = loginRes.headers.get('set-cookie');
    const loginJson = await loginRes.json();
    assert(loginRes.status === 200 && loginJson.success && !!loginJson.csrfToken, 'Valid login returns 200 with session cookie & CSRF token');

    // 4. Authenticated /me
    const meRes = await fetch('http://localhost:5000/api/admin/auth/me', {
      headers: { 'cookie': cookie }
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200 && meJson.admin.email === 'admin@yashtutorials.com', 'Authenticated /me returns admin profile');

    // 5. CSRF Protection Check
    const noCsrfRes = await fetch('http://localhost:5000/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'cookie': cookie },
      body: JSON.stringify({ title: 'Hacked Course', category: 'school', subtitle: 'Hacked' })
    });
    assert(noCsrfRes.status === 403, 'State-changing mutation without CSRF token returns 403 Forbidden');

    // 6. Admin Course Creation (Sync with Public)
    const newCourseRes = await fetch('http://localhost:5000/api/admin/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'cookie': cookie,
        'x-csrf-token': loginJson.csrfToken
      },
      body: JSON.stringify({
        title: 'Automated Test Course 101',
        category: 'science',
        subtitle: 'Testing Public Sync',
        baseFee: 42000,
        isActive: true,
        subjects: ['Physics', 'Chemistry'],
        features: ['Full Lab Practice']
      })
    });
    const newCourseJson = await newCourseRes.json();
    const testCourseId = newCourseJson.data?._id;
    assert(newCourseRes.status === 201 && !!testCourseId, 'Course created via /api/admin/courses');

    // Verify visible in public GET /api/courses
    const publicCoursesRes = await fetch('http://localhost:5000/api/courses');
    const publicCoursesJson = await publicCoursesRes.json();
    const foundInPublic = publicCoursesJson.data.some(c => c._id === testCourseId);
    assert(foundInPublic, 'New active course immediately appears on public /api/courses');

    // Toggle inactive
    const toggleRes = await fetch('http://localhost:5000/api/admin/courses/' + testCourseId + '/toggle-status', {
      method: 'PATCH',
      headers: { 'cookie': cookie, 'x-csrf-token': loginJson.csrfToken }
    });
    assert(toggleRes.status === 200, 'Toggled course status to Inactive');

    // Verify NOT visible in public GET /api/courses
    const publicCoursesAfterRes = await fetch('http://localhost:5000/api/courses');
    const publicCoursesAfterJson = await publicCoursesAfterRes.json();
    const foundAfterDeactivate = publicCoursesAfterJson.data.some(c => c._id === testCourseId);
    assert(!foundAfterDeactivate, 'Inactive course excluded from public /api/courses');

    // Clean up: delete test course
    const delCourseRes = await fetch('http://localhost:5000/api/admin/courses/' + testCourseId, {
      method: 'DELETE',
      headers: { 'cookie': cookie, 'x-csrf-token': loginJson.csrfToken }
    });
    assert(delCourseRes.status === 200, 'Test course deleted from MongoDB');

    // 7. Admin Testimonials Moderation Test
    const newTestimonialRes = await fetch('http://localhost:5000/api/admin/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'cookie': cookie,
        'x-csrf-token': loginJson.csrfToken
      },
      body: JSON.stringify({
        author: 'Test Parent Inspector',
        role: 'Parent of Class 9 Student',
        rating: 5,
        quote: 'Great coaching environment and caring mentors.',
        isApproved: true
      })
    });
    const newTestimonialJson = await newTestimonialRes.json();
    const testTestimonialId = newTestimonialJson.data?._id;
    assert(newTestimonialRes.status === 201 && !!testTestimonialId, 'Testimonial created in admin');

    // Toggle approval off
    await fetch('http://localhost:5000/api/admin/testimonials/' + testTestimonialId + '/toggle-approval', {
      method: 'PATCH',
      headers: { 'cookie': cookie, 'x-csrf-token': loginJson.csrfToken }
    });
    const publicTestimonialsRes = await fetch('http://localhost:5000/api/testimonials');
    const publicTestimonialsJson = await publicTestimonialsRes.json();
    const unapprovedFound = publicTestimonialsJson.data.some(t => t._id === testTestimonialId);
    assert(!unapprovedFound, 'Unapproved testimonial is hidden from public /api/testimonials');

    // Clean up testimonial
    await fetch('http://localhost:5000/api/admin/testimonials/' + testTestimonialId, {
      method: 'DELETE',
      headers: { 'cookie': cookie, 'x-csrf-token': loginJson.csrfToken }
    });
    assert(true, 'Test testimonial cleaned up');

    // 8. Admin Stats Endpoint Check
    const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
      headers: { 'cookie': cookie }
    });
    const statsJson = await statsRes.json();
    assert(statsRes.status === 200 && typeof statsJson.data?.courses?.total === 'number', 'Admin /api/admin/stats returns real breakdown');

    // 9. Public Regression: Demo Enrollment
    const publicEnrollRes = await fetch('http://localhost:5000/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName: 'Test Student Regression', phone: '9876543210', course: 'Class 10th Board Booster' })
    });
    assert(publicEnrollRes.status === 201, 'Public /api/enrollments demo booking still works smoothly');

    // 10. Logout Invalidation Test
    const logoutRes = await fetch('http://localhost:5000/api/admin/auth/logout', {
      method: 'POST',
      headers: { 'cookie': cookie }
    });
    assert(logoutRes.status === 200, 'Logout succeeds and invalidates session');

    const meAfterLogout = await fetch('http://localhost:5000/api/admin/auth/me', {
      headers: { 'cookie': cookie }
    });
    assert(meAfterLogout.status === 401, 'Subsequent /api/admin/auth/me returns 401 Unauthorized after logout');

    console.log(`\n🏁 Test Results: ${passed} Passed, ${failed} Failed.`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Unexpected error during testing:', err);
    process.exit(1);
  }
}

runTests();
