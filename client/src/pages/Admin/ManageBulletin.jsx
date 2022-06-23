import React, { useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { Button } from "../../components/Buttons/Main";
import Table from "../../components/Table/Table";
import { useAuthHeader } from "../../utils/authService";
import { postCategories, useIsMounted } from "../../utils/general";
import { apiClient } from "../../utils/requests";
const ManageBulletin = () => {
  const [data, setData] = useState({
    title: "",
    text: "",
    header_text: "",
    header_url:
      "https://www.cloudsavvyit.com/p/uploads/2021/09/fa4a560f.jpg?width=1198&trim=1,1&bg-color=000&pad=1,1",
    tags: [],
  });
  const [fetchPosts, setFetchPosts] = useState(false);
  const authConfig = useAuthHeader();

  const tagSelRef = useRef(null);

  const handleChange = ({ target }) => {
    setData((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };
  const handleAddTag = ({ target }) => {
    if (target.value && !data.tags.includes(target.value)) {
      setData((prev) => {
        return { ...prev, tags: [...prev.tags, target.value] };
      });
    }
    tagSelRef.current.value = "";
  };
  const handleRmvTag = ({ target }) => {
    setData((prev) => {
      const ind = prev.tags.indexOf(target.getAttribute("data-name"));
      prev.tags.splice(ind, 1);
      return { ...prev, tags: prev.tags };
    });
  };

  const handlePost = (e) => {
    e.preventDefault();
    apiClient
      .post("bulletin", data, authConfig)
      .then((res) => {
        // if (res.status === 201) getIntpost();
        if (res.status === 201) {
          setFetchPosts(!fetchPosts);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message || err.message);
      });
  };

  return (
    <div className="w-full">
      <form className="w-full py-1" onSubmit={handlePost}>
        <span className="inline-flex w-3/4 justify-between ">
          <label>
            Title
            <input
              type="text"
              value={data.title}
              name="title"
              className="form-input !w-40"
              onChange={handleChange}
            />
          </label>
          <label>
            Text
            <textarea
              value={data.text}
              name="text"
              className="form-input !w-40"
              onChange={handleChange}
            />
          </label>
          <label>
            Header image
            <input
              type="text"
              value={data.header_url}
              name="header_url"
              className="form-input !w-40"
              onChange={handleChange}
            />
          </label>
          <label>
            Describe the header
            <input
              type="text"
              value={data.header_text}
              name="header_text"
              className="form-input !w-40"
              onChange={handleChange}
            />
          </label>
          {data.tags?.map((tag) => {
            return (
              <span
                key={tag}
                onClick={handleRmvTag}
                data-name={tag}
                className={
                  postCategories[tag].color +
                  " text-white px-4 py-2 m-2 rounded-sm font-semibold"
                }
              >
                {postCategories[tag].text}
              </span>
            );
          })}
          <select onChange={handleAddTag} ref={tagSelRef}>
            <option value=""></option>
            <option value="event">Event</option>
            <option value="news">News</option>
            <option value="announcement">Announcement</option>
            <option value="report">Report</option>
            <option value="inquiry">Inquiry</option>
          </select>
        </span>
        <Button
          primary
          disabled={data.tags?.length === 0 ? true : false}
          type="submit"
        >
          Add
        </Button>
      </form>
      <BulletinTable authConfig={authConfig} fetchPosts={fetchPosts} />
    </div>
  );
};
const EventManager = ({ authConfig }) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    date: new Date(),
  });
  const [fetchEvents, setFetchEvents] = useState(false);

  const handleChange = ({ target }) => {
    setData((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const handleNewEvent = (e) => {
    e.preventDefault();
    apiClient
      .post("bulletin/events", data, authConfig)
      .then((res) => {
        if (res.status === 201) {
          setFetchEvents(!fetchEvents);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message || err.message);
      });
  };
  return (
    <div className="w-full">
      <form className="w-full py-1" onSubmit={handleNewEvent}>
        <span className="inline-flex w-3/4 justify-between ">
          <label>
            Title
            <input
              type="text"
              value={data.title}
              name="title"
              className="form-input !w-40"
              onChange={handleChange}
            />
          </label>
          <label>
            Description
            <textarea
              value={data.description}
              name="description"
              className="form-input !w-40"
              onChange={handleChange}
            />
          </label>
          <label>
            Date of event
            <input
              type="date"
              value={data.date}
              name="date"
              className="form-input !w-40"
              onChange={handleChange}
            />
          </label>

          <Button
            primary
            disabled={data.tags?.length === 0 ? true : false}
            type="submit"
          >
            Add
          </Button>
        </span>
      </form>
    </div>
  );
};
const BulletinTable = ({ authConfig, fetchPosts }) => {
  const isMounted = useIsMounted();

  const [paginate, setPaginate] = useState({
    data: [],
    total_count: 1,
    total_pages: 1,
    page_size: 20,
  });
  const [loading, setLoading] = useState(false);
  const columns = React.useMemo(() => [
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "Text",
      accessor: "text",
    },
  ]);

  const fetchNewPosts = useCallback(
    ({ pageIndex, pageSize }) => {
      setLoading(true);
      apiClient
        .get(`bulletin?limit=${pageSize}&page=${pageIndex}`, authConfig)
        .then((res) => {
          if (res.status === 200 && isMounted) {
            setPaginate({ ...res.data, page_size: paginate.page_size });
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message || err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [fetchPosts]
  );

  return (
    <>
      <Table
        columns={columns}
        paginate={paginate}
        fetchData={fetchNewPosts}
        loading={loading}
      />
    </>
  );
};
export default ManageBulletin;
