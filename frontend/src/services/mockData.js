export const getGradeSyllabus = async (gradeId) => {
    // Call backend endpoint
    // Note: gradeId typically coming as "grade5", "5", etc. Ensure we pass integer.
    const id = typeof gradeId === 'string' ? gradeId.replace('grade', '') : gradeId;
    const response = await fetch(`${BASE_URL}/api/v1/question-templates/syllabus/${id}`, {
        headers: getHeaders()
    });
    return handleResponse(response);
};
