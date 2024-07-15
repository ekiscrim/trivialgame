import RoomCard from "./RoomCard";
import SuperRoomCard from "./SuperRoomCard";
import CategoryFilter from "./CategoryFilter";

const TabContent = ({ activeTab, rooms, categories, onCategoryChange, userId, simplifyDesign }) => {
    const filteredRooms = () => {
      switch (activeTab) {
        case "waiting":
          return rooms.filter(room => room.status === "waiting");
        case "finished":
          return rooms.filter(room => room.status === "finished");
        case "created":
          return rooms.filter(room => room.users.length > 0 && room.users[0] === userId);
        case "pending": // Ahora confiamos en que el controlador ya filtra las salas sin puntuación
          return rooms.filter(room => !room.userScore || !room.userScore.hasScore);
        case "category":
          return rooms.filter(room => room.categories.some(cat => categories.includes(cat)));
        default:
          return rooms;
      }
    };
  
    const renderedRooms = filteredRooms();
  
    return (
      <>
        {activeTab === "category" ? (
          <CategoryFilter categories={categories} onCategoryChange={onCategoryChange} />
        ) : (
          <>
            {renderedRooms.length === 0 ? (
               <div className="bg-white rounded-lg shadow-md p-4 m-2 text-center">
                  <p className="text-lg text-gray-800 mb-4">Todas las salas están hechas 😊</p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6 animate-scale-in">
                {renderedRooms.map((room, index) => (
                  <div key={index} className="w-80 relative overflow-hidden rounded-lg transition-transform duration-300 transform hover:scale-105">
                    {room.roomType === 'super' 
                      ? <SuperRoomCard room={room} userId={userId} simplifyDesign={simplifyDesign} />
                      : <RoomCard room={room} userId={userId} simplifyDesign={simplifyDesign} />
                    }
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </>
    );
  };
  
  export default TabContent;