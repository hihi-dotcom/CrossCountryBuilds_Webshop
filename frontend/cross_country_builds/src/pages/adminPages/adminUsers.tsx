import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import type Guest from "../../models/guest";

export default function UsersDashboard() {
  const initUsers = useLoaderData();
  const [users, setUsers] = useState<Guest[]>(initUsers);
  const [error, setError] = useState("");

  useEffect(() => {
    setUsers(initUsers);
  }, [initUsers]);

  const UsernameRef = useRef<HTMLInputElement>(null);

  function handleSearchforUser() {
    const searchedUser = UsernameRef.current?.value;

    if (!searchedUser) {
      setUsers(initUsers);
      return;
    }

    const filteredUsers = initUsers.filter((user: any) =>
      user.username.includes(searchedUser),
    );
    setUsers(filteredUsers);
  }
  return (
    <>
      <section className="min-h-screen py-6 px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div
            id="kereses"
            className="rounded-xl py-2 pr-2  border-2 text-black mt-15 border-black flex flex-col h-fit "
          >
            <h2 className="text-2xl text-center">User keresés (név alapján)</h2>
            <div className="flex flex-row">
              <div id="kereso-mezo" className="w-full py-3  px-1 text-lg">
                <label htmlFor="productname" className="text-base">
                  Adj meg felhasználónevet:{" "}
                </label>
                <input
                  type="text"
                  name="productname"
                  id="productname"
                  className="text-black border-black border-2 bg-white rounded-xl px-2 h-10 w-full"
                  placeholder="a felhasználónév"
                  onChange={handleSearchforUser}
                  ref={UsernameRef}
                />
              </div>
              <div
                id="kereses-gomb"
                className=" flex items-center justify-center"
              >
                <button
                  type="submit"
                  onClick={handleSearchforUser}
                  className=" text-lg bg-[#08415c] text-white px-2 py-2 rounded-lg    hover:font-bold"
                >
                  Keresés!
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border mt-15 border-gray-200">
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-sm md:text-2xl font-bold text-gray-800">
              Felhasználók kezelése
            </h1>
          </div>

          <div className="overflow-x-auto">
            {error && (
              <div className="text-red-500 bg-red-200 p-2 rounded">{error}</div>
            )}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 text-gray-500 text-sm uppercase">
                  <th className="py-3 px-2">Felhasználónév</th>
                  <th className="py-3 px-2">E-mail</th>
                  <th className="py-3 px-2">Jogosultság</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500 text-black text-base">
                {users.map((user) => (
                  <tr
                    className="hover:bg-blue-50/50 transition-colors"
                    key={user.id}
                  >
                    <td className="py-3 px-2">{user.username}</td>
                    <td className="py-3 px-2">{user.email}</td>
                    <td className="py-3 px-2 bg-blue-100 text-blue-700 rounded text-base font-bold">
                      {user.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
