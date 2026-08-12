import { useState, useEffect } from "react";

import { apiService } from "../../services/apiService";
import { useAuth } from "../../contexts/AuthContext";

import {
  Search,
  Lock,
  Unlock,
} from "lucide-react";

import { CozyBadge } from "../../components/common/UIComponents";


export const AdminUsersPage = () => {

  const { addToast } = useAuth();


  // =========================================================
  // STATE
  // =========================================================

  const [users, setUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [updatingUserId, setUpdatingUserId] =
    useState(null);


  // =========================================================
  // SAFE ARRAY NORMALIZER
  // =========================================================

  const toArray = (response) => {

    if (Array.isArray(response)) {
      return response;
    }

    if (
      response &&
      Array.isArray(response.data)
    ) {
      return response.data;
    }

    return [];
  };


  // =========================================================
  // LOAD USERS
  // =========================================================

  const loadUsers = async () => {

    try {

      setIsLoading(true);


      const response =
        await apiService.getAdminUsers();


      const userList =
        toArray(response);


      setUsers(userList);

    } catch (error) {

      console.error(
        "Error loading admin users:",
        error
      );


      setUsers([]);


      addToast(
        "Unable to Load Users",
        "Could not retrieve registered users.",
        "warning"
      );

    } finally {

      setIsLoading(false);

    }

  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    let isMounted = true;


    const load = async () => {

      try {

        const response =
          await apiService.getAdminUsers();


        if (!isMounted) {
          return;
        }


        setUsers(
          toArray(response)
        );

      } catch (error) {

        console.error(
          "Error loading admin users:",
          error
        );


        if (isMounted) {
          setUsers([]);
        }

      } finally {

        if (isMounted) {
          setIsLoading(false);
        }

      }

    };


    load();


    return () => {
      isMounted = false;
    };

  }, []);


  // =========================================================
  // TOGGLE USER STATUS
  // =========================================================

  const handleToggleStatus = async (
    id,
    name
  ) => {

    try {

      setUpdatingUserId(id);


      const response =
        await apiService.toggleUserStatus(
          id
        );


      /*
       * Some implementations return:
       *
       * {
       *   success: true,
       *   data: {...}
       * }
       *
       * while others simply return the
       * updated user.
       *
       * We therefore reload the authoritative
       * user list from the backend afterwards.
       */

      await loadUsers();


      const success =
        response?.success !== false;


      if (success) {

        addToast(
          "Status Updated",
          `Updated access status for ${name}`,
          "info"
        );

      } else {

        addToast(
          "Status Update Failed",
          response?.message ||
            `Could not update ${name}'s access status.`,
          "warning"
        );

      }

    } catch (error) {

      console.error(
        "Error toggling user status:",
        error
      );


      addToast(
        "Status Update Failed",
        `Could not update ${name}'s access status.`,
        "warning"
      );

    } finally {

      setUpdatingUserId(null);

    }

  };


  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const normalizedSearch =
    search.trim().toLowerCase();


  const filtered =
    users.filter((u) => {

      const name =
        String(
          u?.name ||
          u?.full_name ||
          u?.fullName ||
          u?.username ||
          ""
        ).toLowerCase();


      const email =
        String(
          u?.email ||
          u?.user_email ||
          ""
        ).toLowerCase();


      return (
        name.includes(
          normalizedSearch
        ) ||
        email.includes(
          normalizedSearch
        )
      );

    });


  // =========================================================
  // USER HELPERS
  // =========================================================

  const getName = (user) => {

    return (
      user?.name ||
      user?.full_name ||
      user?.fullName ||
      user?.username ||
      "MindBloom User"
    );

  };


  const getEmail = (user) => {

    return (
      user?.email ||
      user?.user_email ||
      "—"
    );

  };


  const getJoinedDate = (user) => {

    const value =
      user?.joinedDate ||
      user?.date_joined ||
      user?.created_at ||
      user?.createdAt;


    if (!value) {
      return "—";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }


    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  const getJournalCount = (user) => {

    const count =
      user?.journalCount ??
      user?.journal_count ??
      0;


    return Number.isFinite(
      Number(count)
    )
      ? Number(count)
      : 0;

  };


  const getStatus = (user) => {

    if (
      user?.status
    ) {
      return String(
        user.status
      ).toLowerCase();
    }


    if (
      user?.is_active === true
    ) {
      return "active";
    }


    if (
      user?.is_active === false
    ) {
      return "inactive";
    }


    return "active";

  };


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="space-y-6 pb-12">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div>

          <h1 className="font-serif text-2xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">

            User Management

          </h1>


          <p className="text-xs text-[#8C7667] dark:text-[#A8988B] mt-1">

            Inspect accounts, manage access status, and view activity history.

          </p>

        </div>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="relative w-full sm:w-64">

          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667] pointer-events-none" />


          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="cozy-input w-full !pl-10 py-2 text-xs"
          />

        </div>

      </div>


      {/* ===================================================
          USERS TABLE
      =================================================== */}

      <div className="cozy-card p-6 space-y-4">

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse text-xs">

            {/* ------------------------------------------------
                TABLE HEADER
            ------------------------------------------------ */}

            <thead>

              <tr className="border-b border-[#EFE6DC] dark:border-[#3D3128] text-[#8C7667] dark:text-[#A8988B] font-semibold">

                <th className="py-2.5 px-3">
                  User
                </th>

                <th className="py-2.5 px-3">
                  Joined
                </th>

                <th className="py-2.5 px-3">
                  Journals Created
                </th>

                <th className="py-2.5 px-3">
                  Status
                </th>

                <th className="py-2.5 px-3 text-right">
                  Actions
                </th>

              </tr>

            </thead>


            {/* ------------------------------------------------
                TABLE BODY
            ------------------------------------------------ */}

            <tbody className="divide-y divide-[#EFE6DC] dark:divide-[#3D3128]">

              {/* =================================================
                  LOADING
              ================================================= */}

              {isLoading ? (

                <tr>

                  <td
                    colSpan={5}
                    className="py-10 text-center text-xs text-[#8C7667] dark:text-[#A8988B]"
                  >

                    Loading registered accounts...

                  </td>

                </tr>

              ) : filtered.length === 0 ? (

                /* ===============================================
                   EMPTY
                =============================================== */

                <tr>

                  <td
                    colSpan={5}
                    className="py-10 text-center text-xs text-[#8C7667] dark:text-[#A8988B] italic"
                  >

                    {search.trim()
                      ? "No users match your search."
                      : "No registered accounts found."
                    }

                  </td>

                </tr>

              ) : (

                /* ===============================================
                   USERS
                =============================================== */

                filtered.map(
                  (u, index) => {

                    const userName =
                      getName(u);

                    const userEmail =
                      getEmail(u);

                    const status =
                      getStatus(u);

                    const journalCount =
                      getJournalCount(u);

                    const isUpdating =
                      updatingUserId ===
                      u?.id;


                    return (

                      <tr
                        key={
                          u?.id ??
                          u?.user_id ??
                          index
                        }
                        className="hover:bg-[#FAF6F0] dark:hover:bg-[#2F2620] transition"
                      >

                        {/* USER */}

                        <td className="py-3 px-3">

                          <div className="font-semibold text-[#3B281C] dark:text-[#FFFBF7]">

                            {userName}

                          </div>


                          <div className="text-[10px] text-[#8C7667] dark:text-[#A8988B]">

                            {userEmail}

                          </div>

                        </td>


                        {/* JOINED */}

                        <td className="py-3 px-3 text-[#705D52] dark:text-[#D4C3B3]">

                          {getJoinedDate(u)}

                        </td>


                        {/* JOURNALS */}

                        <td className="py-3 px-3 font-semibold text-[#3B281C] dark:text-[#FFFBF7]">

                          {journalCount}{" "}
                          {journalCount === 1
                            ? "entry"
                            : "entries"}

                        </td>


                        {/* STATUS */}

                        <td className="py-3 px-3">

                          <CozyBadge
                            variant={
                              status ===
                              "active"
                                ? "sage"
                                : "autumn"
                            }
                          >

                            {status}

                          </CozyBadge>

                        </td>


                        {/* ACTION */}

                        <td className="py-3 px-3 text-right">

                          <button
                            type="button"
                            disabled={
                              isUpdating
                            }
                            onClick={() =>
                              handleToggleStatus(
                                u.id,
                                userName
                              )
                            }
                            className={`
                              px-3
                              py-1.5
                              rounded-lg
                              text-xs
                              font-semibold
                              flex
                              items-center
                              gap-1.5
                              ml-auto
                              transition
                              disabled:opacity-50
                              disabled:cursor-not-allowed

                              ${
                                status ===
                                "active"

                                  ? "bg-[#FBEBE6] text-[#B8543B] hover:bg-[#F4CFC5]"

                                  : "bg-[#EAEFE6] text-[#4F5D3D] hover:bg-[#D2DEC8]"
                              }
                            `}
                          >

                            {status ===
                            "active" ? (

                              <>

                                <Lock className="w-3.5 h-3.5" />

                                <span>
                                  {isUpdating
                                    ? "Suspending..."
                                    : "Suspend"}
                                </span>

                              </>

                            ) : (

                              <>

                                <Unlock className="w-3.5 h-3.5" />

                                <span>
                                  {isUpdating
                                    ? "Reactivating..."
                                    : "Reactivate"}
                                </span>

                              </>

                            )}

                          </button>

                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};