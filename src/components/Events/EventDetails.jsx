import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "../Header.jsx";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const { data, isPending, isError } = useQuery({
    queryKey: ["events", params.id],
    queryFn: async ({ signal }) => {
      const eventData = await fetchEvent({ signal, id: params.id });
      return eventData;
    },
  });
  const { mutate } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events");
    },
  });

  const handleDelete = () => {
    mutate({ id: params.id });
  };
  let content = "";
  if (isPending) {
    content = <p>Loading...</p>;
  }
  if (isError) {
    content = "Error occurred";
  }
  if (data) {
    content = (
      <>
        <Outlet />
        <Header>
          <Link to="/events" className="nav-item">
            View all Events
          </Link>
        </Header>
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={handleDelete}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt="" />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {data.date} {data.time}
                </time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>
      </>
    );
  }
  return content;
}
