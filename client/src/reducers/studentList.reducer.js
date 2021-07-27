const studentListReducer = (studentList = [], action) => {
  if (action.type === 'setStudentList'){
    return action.list;
  } else {
    return studentList;
  }
};

export default studentListReducer;