import { useQuery } from "@tanstack/react-query";
import ScoresTable from "../../components/score/ScoresTable";
import { useParams } from "react-router-dom";

const ResultsPage = () => {

  const { data: userId } = useQuery({ queryKey: ["authUser"] });
  const roomId = useParams();
  return (
    <ScoresTable currentUser={userId} roomId={roomId} />
  );
};

export default ResultsPage;
