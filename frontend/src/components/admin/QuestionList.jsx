import QuestionItem from './QuestionItem';

const QuestionList = ({ questions, onEdit, onDelete }) => {
  return (
    <ul className="list-disc pl-5 w-full">
      {questions.map((question, index) => (
        <QuestionItem
          key={question._id}
          question={question}
          index={index}
          onEdit={() => onEdit(question)}
          onDelete={() => onDelete(question._id)}
        />
      ))}
    </ul>
  );
};

export default QuestionList;
