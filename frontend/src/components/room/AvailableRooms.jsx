import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";


const AvailableRooms = () => {
    const queryClient = useQueryClient();
    const {data: listRoomsQuery, isLoading, error} = useQuery({
        queryKey: ['listRooms'],
        queryFn: async() => {
            try {
				const res = await fetch("/rooms/list")
				const data = await res.json();
                if (data.error) throw new Error(data.error);
				if (!res.ok ||data.error) throw new Error(data.error || "Algo fue mal");
				return data;

			} catch (error) {
				throw new Error(error.message);	
			}
		},
    });

    useEffect(() => {
        const interval = setInterval(() => {
            queryClient.invalidateQueries("listRooms");
        }, 900000); // 15 minutos
        return () => clearInterval(interval);
    }, [queryClient]); 

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <><div className="mt-6 ml-4 grid sm:grid-flow-row md:grid-flow-row md:grid-cols-2 gap-y-5 content-stretch"><div role="alert" className="alert">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <span>{error.message}</span>
  </div></div></>;

    return(
        <>
            {!listRoomsQuery || listRoomsQuery.length === 0 ? (
                <p>{error.message}</p>
            ) : (
                
                <div className="mt-6 ml-4 h-56 grid sm:grid-flow-row md:grid-flow-row md:grid-cols-2 gap-y-5 content-stretch">
                    {listRoomsQuery.map((room, index) => (
                        <div key={index} className="card w- bg-primary text-primary-content max-w-md">
                            <div className="card-body">
                                <h2 className="card-title">{room.roomName}</h2>
                                <p>{`Max Users: ${room.maxUsers}`}</p>
                                <div className="card-actions justify-end">
                                    <button className="btn">Unirse</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
};
export default AvailableRooms;
