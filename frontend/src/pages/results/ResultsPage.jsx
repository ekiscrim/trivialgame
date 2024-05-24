import { useQuery } from "@tanstack/react-query";
import ScoresTable from "../../components/score/ScoresTable";

const ResultsPage = () => {

  const { data: userId } = useQuery({ queryKey: ["authUser"] });

  return (
    <ScoresTable currentUser={userId} />
  );
};

export default ResultsPage;
