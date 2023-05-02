import FetchUserInfo from "./FetchUserInfo";
import ImportUsers from "./ImportUsers";

function Users() {
  return (
    <div className="col-start-3 col-end-13 p-8">
      <div className="mx-auto max-w-xl">
        <ImportUsers />
        <FetchUserInfo />
      </div>
    </div>
  );
}

export default Users;
