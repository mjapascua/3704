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

  const [toEdit, setToEdit] = useState(null);
  const chooseEdit = (item) => {
    setToEdit(item);
  };
  const cancelEdit = () => {
    setToEdit(null);
  };

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
          toggleFetch();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message || err.message);
      });
  };
  const toggleFetch = () => {
    setFetchPosts(!fetchPosts);
  };

  return (
    <div className="w-full">
      <div className="w-4/5 border mr-5 inline-block h-fit px-4 py-3 shadow-md rounded">
        <form className="" onSubmit={handlePost}>
          <span className="font-bold block text-lg mb-5 text-slate-600">
            Create a post
          </span>
          <div className="flex">
            <span className="inline-flex mr-2 flex-col w-1/2 ">
              <span className="">
                <label className="w-fit inline-block">
                  <span className="block">Title</span>
                  <input
                    type="text"
                    value={data.title}
                    name="title"
                    className="form-input !w-72"
                    onChange={handleChange}
                  />
                </label>
                <label className="inline-block">
                  <span className="block">Category</span>
                  <select
                    onChange={handleAddTag}
                    className="my-2 h-9 w-44"
                    ref={tagSelRef}
                  >
                    <option value=""></option>
                    <option value="event">Event</option>
                    <option value="news">News</option>
                    <option value="announcement">Announcement</option>
                    <option value="report">Report</option>
                    <option value="inquiry">Inquiry</option>
                  </select>
                </label>
              </span>
              <span className="h-14">
                {data.tags?.map((tag) => {
                  return (
                    <span
                      key={tag}
                      onClick={handleRmvTag}
                      data-name={tag}
                      className={
                        postCategories[tag].color +
                        " text-white px-2 inline-flex justify-center hover:bg-rose-600 select-none w-32 py-1 mr-2 rounded-sm font-semibold"
                      }
                      onMouseEnter={(e) => (e.target.innerText = "x")}
                      onMouseLeave={(e) =>
                        (e.target.innerText = postCategories[tag].text)
                      }
                    >
                      {postCategories[tag].text}
                    </span>
                  );
                })}
              </span>
              <span className="flex">
                <label className="w-fit inline-block">
                  Header image
                  <input
                    type="text"
                    value={data.header_url}
                    name="header_url"
                    className="form-input"
                    onChange={handleChange}
                  />
                </label>
                <label className="w-fit ml-3">
                  Describe the header
                  <input
                    type="text"
                    value={data.header_text}
                    name="header_text"
                    className="form-input"
                    onChange={handleChange}
                  />
                </label>
              </span>
            </span>
            <span className="w-1/2 ml-2 inline-block">
              <label className="w-full">
                Text
                <textarea
                  value={data.text}
                  name="text"
                  className="form-input"
                  onChange={handleChange}
                  placeholder="Details"
                />
              </label>
            </span>
          </div>
          <br />
          <span className="w-full flex justify-end mt-2">
            <Button
              primary
              className="w-44"
              disabled={
                data.tags.length === 0 ||
                !data.title ||
                !data.header_url ||
                !data.header_text
              }
              type="submit"
            >
              Add
            </Button>
          </span>
        </form>
      </div>
      <span className="font-bold block text-lg px-1 mb-5 mt-20 text-slate-600">
        Posts
      </span>
      {toEdit && (
        <PostEditor
          item={toEdit}
          toggleFetch={toggleFetch}
          cancelEdit={cancelEdit}
        />
      )}

      <BulletinTable
        authConfig={authConfig}
        fetchPosts={fetchPosts}
        chooseEdit={chooseEdit}
      />
    </div>
  );
};

const PostEditor = ({ item, cancelEdit, toggleFetch }) => {
  const [data, setData] = useState({
    title: item.title,
    text: item.text,
    header_text: item.header_image.text,
    header_url: item.header_image.url,
    tags: item.tags,
  });
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
      .put("bulletin/" + item._id, data, authConfig)
      .then((res) => {
        if (res.status === 200) {
          toggleFetch();
          cancelEdit();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message || err.message);
      });
  };

  return (
    <div className="w-4/5 border mr-5 inline-block h-fit px-4 py-3 shadow-md rounded">
      <form className="" onSubmit={handlePost}>
        <span className="font-bold block text-lg mb-5 text-slate-600">
          Edit {item.title}
        </span>
        <div className="flex">
          <span className="inline-flex mr-2 flex-col w-1/2 ">
            <span className="">
              <label className="w-fit inline-block">
                <span className="block">Title</span>
                <input
                  type="text"
                  value={data.title}
                  name="title"
                  className="form-input !w-72"
                  onChange={handleChange}
                />
              </label>
              <label className="inline-block">
                <span className="block">Category</span>
                <select
                  onChange={handleAddTag}
                  className="my-2 h-9 w-44"
                  ref={tagSelRef}
                >
                  <option value=""></option>
                  <option value="event">Event</option>
                  <option value="news">News</option>
                  <option value="announcement">Announcement</option>
                  <option value="report">Report</option>
                  <option value="inquiry">Inquiry</option>
                </select>
              </label>
            </span>
            <span className="h-14">
              {data.tags?.map((tag) => {
                return (
                  <span
                    key={tag}
                    onClick={handleRmvTag}
                    data-name={tag}
                    className={
                      postCategories[tag].color +
                      " text-white px-2 inline-flex justify-center hover:bg-rose-600 select-none w-32 py-1 mr-2 rounded-sm font-semibold"
                    }
                    onMouseEnter={(e) => (e.target.innerText = "x")}
                    onMouseLeave={(e) =>
                      (e.target.innerText = postCategories[tag].text)
                    }
                  >
                    {postCategories[tag].text}
                  </span>
                );
              })}
            </span>
            <span className="flex">
              <label className="w-fit inline-block">
                Header image
                <input
                  type="text"
                  value={data.header_url}
                  name="header_url"
                  className="form-input"
                  onChange={handleChange}
                />
              </label>
              <label className="w-fit ml-3">
                Describe the header
                <input
                  type="text"
                  value={data.header_text}
                  name="header_text"
                  className="form-input"
                  onChange={handleChange}
                />
              </label>
            </span>
          </span>
          <span className="w-1/2 ml-2 inline-block">
            <label className="w-full">
              Text
              <textarea
                value={data.text}
                name="text"
                className="form-input"
                onChange={handleChange}
                placeholder="Details"
              />
            </label>
          </span>
        </div>
        <br />
        <span className="w-full flex justify-end mt-2">
          <Button
            primary
            className="w-44 mr-3 !bg-rose-500"
            disabled={
              data.tags.length === 0 ||
              !data.title ||
              !data.header_url ||
              !data.header_text
            }
            onClick={cancelEdit}
          >
            Cancel
          </Button>
          <Button
            primary
            className="w-44"
            disabled={
              data.tags.length === 0 ||
              !data.title ||
              !data.header_url ||
              !data.header_text
            }
            type="submit"
          >
            Save
          </Button>
        </span>
      </form>
    </div>
  );
};

const BulletinTable = ({ authConfig, fetchPosts, chooseEdit }) => {
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
      width: "10",
    },
    {
      Header: "Text",
      accessor: "text",
      width: "100",
    },
    {
      Header: "Edit",
      Cell: ({ row }) => {
        return (
          <span
            onClick={() => chooseEdit(row.original)}
            className="text-cyan-600 material-icons-sharp cursor-pointer mx-3"
          >
            edit
          </span>
        );
      },
      width: "100",
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
    <Table
      columns={columns}
      paginate={paginate}
      fetchData={fetchNewPosts}
      loading={loading}
    />
  );
};
export default ManageBulletin;
