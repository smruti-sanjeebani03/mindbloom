// MindBloom API Service - Consolidating React Frontend with Django REST Framework & PostgreSQL

const getAuthHeaders = () => {
  const token = localStorage.getItem("mindbloom_access_token");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const apiService = {
  // =========================================================
  // TOKEN MANAGEMENT
  // =========================================================

  getAccessToken: () =>
    localStorage.getItem("mindbloom_access_token") || "",

  getRefreshToken: () =>
    localStorage.getItem("mindbloom_refresh_token") || "",

  setTokens: (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem("mindbloom_access_token", accessToken);
    }

    if (refreshToken) {
      localStorage.setItem("mindbloom_refresh_token", refreshToken);
    }
  },

  clearTokens: () => {
    localStorage.removeItem("mindbloom_access_token");
    localStorage.removeItem("mindbloom_refresh_token");
    localStorage.removeItem("mindbloom_user");
    localStorage.removeItem("mindbloom_admin_logged_in");
    localStorage.removeItem("mindbloom_admin_profile");
  },

  // =========================================================
  // USER & AUTHENTICATION
  // =========================================================

  getUser: () => {
    try {
      const stored = localStorage.getItem("mindbloom_user");

      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error reading cached user profile:", error);
    }

    return {
      name: "",
      email: "",
      isLoggedIn: false,
      chat_count: 0,
      subscription_type: "free",
      subscription_status: "inactive",
    };
  },

  updateUser: (updates) => {
    const current = apiService.getUser();
    const updated = { ...current, ...updates };

    try {
      localStorage.setItem(
        "mindbloom_user",
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Error updating local user profile:", error);
    }

    return updated;
  },

  loginUser: async (email, password) => {
    try {
      const response = await fetch(
        "/api/auth/login-or-register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.access_token) {
        apiService.setTokens(
          data.access_token,
          data.refresh_token
        );

       const userData = {
  email: data.user.email,
  name:
    data.user.full_name ||
    data.user.first_name ||
    email.split("@")[0],

  bio: data.user.bio || "",
    date_joined: data.user.date_joined || null,

  isLoggedIn: true,

  chat_count:
    data.user.chat_count || 0,

  subscription_type:
    data.user.subscription_type || "free",

  subscription_status:
    data.user.subscription_status || "inactive",

  subscription_expiry:
    data.user.subscription_expiry || null,

  is_staff:
    data.user.is_staff || false,

  is_superuser:
    data.user.is_superuser || false,
};

        apiService.updateUser(userData);

        return {
          success: true,
          user: userData,
          message: data.message,
        };
      }

      return {
        success: false,
        message:
          data.message ||
          data.detail ||
          "Authentication failed.",
      };
    } catch (error) {
      console.error("Login API Error:", error);

      return {
        success: false,
        message:
          "Unable to connect to MindBloom backend server.",
      };
    }
  },

  registerAccount: async ({
    email,
    name,
    password,
  }) => {
    try {
      const response = await fetch(
        "/api/auth/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            full_name: name,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: "Account created successfully.",
        };
      }

      let errorMsg =
        data.message || "Registration failed.";

      if (data.errors) {
        if (typeof data.errors === "string") {
          errorMsg = data.errors;
        } else if (
          typeof data.errors === "object"
        ) {
          const firstKey =
            Object.keys(data.errors)[0];

          if (firstKey) {
            errorMsg = Array.isArray(
              data.errors[firstKey]
            )
              ? data.errors[firstKey][0]
              : data.errors[firstKey];
          }
        }
      }

      return {
        success: false,
        message: errorMsg,
      };
    } catch (error) {
      console.error("Register API Error:", error);

      return {
        success: false,
        message:
          "Unable to connect to MindBloom backend server.",
      };
    }
  },

  authenticateGoogleToken: async (
  idToken,
  adminCode = ""
) => {
  try {
    const response = await fetch(
      "/api/auth/google/",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id_token: idToken,
          admin_code: adminCode,
        }),
      }
    );

    const result = await response.json();

    if (
      response.ok &&
      result.status === "success" &&
      result.data?.access_token
    ) {
      const data = result.data;

      apiService.setTokens(
        data.access_token,
        data.refresh_token
      );

      const userData = {
        email: data.user.email,

        name:
          data.user.full_name ||
          data.user.email.split("@")[0],

        isLoggedIn: true,

        picture:
          data.user.picture || "",

        chat_count:
          data.user.chat_count || 0,

        subscription_type:
          data.user.subscription_type || "free",

        subscription_status:
          data.user.subscription_status || "inactive",

        subscription_expiry:
          data.user.subscription_expiry || null,

        // ⭐ ADMIN FLAGS
        is_staff:
          data.user.is_staff || false,

        is_superuser:
          data.user.is_superuser || false,
      };

      apiService.updateUser(userData);

      return {
        success: true,
        user: userData,

        access_token:
          data.access_token,

        refresh_token:
          data.refresh_token,
      };
    }

    return {
      success: false,

      message:
        result.message ||
        result.data?.message ||
        "Google authentication failed.",
    };

  } catch (error) {

    console.error(
      "Google Auth API Error:",
      error
    );

    return {
      success: false,

      message:
        "Unable to communicate with MindBloom backend server.",
    };
  }
},

  logoutUser: async () => {
    const refreshToken =
      apiService.getRefreshToken();

    if (refreshToken) {
      try {
        await fetch(
          "/api/auth/logout/",
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              refresh_token: refreshToken,
            }),
          }
        );
      } catch (error) {
        console.warn(
          "Server logout notification skipped:",
          error
        );
      }
    }

    apiService.clearTokens();

    return {
      name: "",
      email: "",
      isLoggedIn: false,
    };
  },

  deleteAccount: () => {
    apiService.clearTokens();

    return {
      name: "",
      email: "",
      isLoggedIn: false,
    };
  },

 fetchUserProfileBackend: async () => {
  try {
    const response = await fetch(
      "/api/auth/profile/",
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (response.ok && data.data) {
      const profile = data.data;

      const updatedUser = apiService.updateUser({
        name: profile.full_name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        date_joined: profile.date_joined || null,
        chat_count: profile.chat_count || 0,
        subscription_type:
          profile.subscription_type || "free",
        subscription_status:
          profile.subscription_status || "inactive",
        subscription_expiry:
          profile.subscription_expiry || null,
      });

      return {
        success: true,
        data: {
          ...profile,
          ...updatedUser,
        },
      };
    }

    return {
      success: false,
      message:
        data.message ||
        "Failed to fetch user profile.",
    };
  } catch (error) {
    console.error(
      "Error fetching profile:",
      error
    );

    return {
      success: false,
      message:
        "Network error while fetching profile.",
    };
  }
},

updateUserProfileBackend: async (updates) => {
  try {
    const response = await fetch(
      "/api/auth/profile/",
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          full_name:
            updates.full_name ??
            updates.name ??
            "",
          bio: updates.bio ?? "",
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.data) {
      const profile = data.data;

      const updatedUser = apiService.updateUser({
        name: profile.full_name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        date_joined: profile.date_joined || null,
        chat_count: profile.chat_count || 0,
        subscription_type:
          profile.subscription_type || "free",
        subscription_status:
          profile.subscription_status || "inactive",
        subscription_expiry:
          profile.subscription_expiry || null,
      });

      return {
        success: true,
        data: {
          ...profile,
          ...updatedUser,
        },
        message:
          data.message ||
          "Profile updated successfully.",
      };
    }

    return {
      success: false,
      message:
        data.message ||
        "Failed to update profile.",
      errors: data.errors || {},
    };
  } catch (error) {
    console.error(
      "Error updating profile:",
      error
    );

    return {
      success: false,
      message:
        "Network error while updating profile.",
    };
  }
},

  // =========================================================
  // ADMIN PROFILE
  // =========================================================

  isAdminLoggedIn: () => {
    return (
      localStorage.getItem(
        "mindbloom_admin_logged_in"
      ) === "true"
    );
  },

  setAdminLoggedIn: (status) => {
    if (status) {
      localStorage.setItem(
        "mindbloom_admin_logged_in",
        "true"
      );
    } else {
      localStorage.removeItem(
        "mindbloom_admin_logged_in"
      );
    }
  },

  getAdminProfile: () => {
    try {
      const profile =
        localStorage.getItem(
          "mindbloom_admin_profile"
        );

      if (profile) {
        return JSON.parse(profile);
      }
    } catch (error) {
      console.error(
        "Error reading admin profile:",
        error
      );
    }

    return {
      name: "System Administrator",
      email: "admin@mindbloom.app",
    };
  },

  updateAdminProfile: (profile) => {
    try {
      localStorage.setItem(
        "mindbloom_admin_profile",
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error(
        "Error updating admin profile:",
        error
      );
    }
  },

  // =========================================================
  // JOURNALS
  // =========================================================

 getJournals: async () => {
  return apiService.fetchJournalsFromBackend();
},

  fetchJournalsFromBackend: async () => {
  try {
    const response = await fetch("/api/journal/", {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return Array.isArray(data.data)
        ? data.data
        : [];
    }

    console.error(
      "Failed to fetch journals:",
      data
    );

    return [];
  } catch (error) {
    console.error(
      "Error fetching journals:",
      error
    );

    return [];
  }
},

  addJournal: async (title, content) => {
    return apiService.createJournalEntryBackend(
      title,
      content
    );
  },

  createJournalEntryBackend: async (
    title,
    content
  ) => {
    try {
      const response = await fetch(
        "/api/journal/",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          entry: data.data,
        };
      }

      return {
        success: false,
        message:
          data.message ||
          "Failed to save journal entry to server.",
      };
    } catch (error) {
      console.error(
        "Error saving journal:",
        error
      );

      return {
        success: false,
        message:
          "Network error while saving journal entry.",
      };
    }
  },

  updateJournalEntryBackend: async (
    id,
    title,
    content
  ) => {
    try {
      const response = await fetch(
        `/api/journal/${id}/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          entry: data.data,
        };
      }

      return {
        success: false,
        message:
          data.message ||
          "Failed to update journal entry.",
      };
    } catch (error) {
      console.error(
        "Error updating journal:",
        error
      );

      return {
        success: false,
        message:
          "Network error while updating journal entry.",
      };
    }
  },

  deleteJournalEntryBackend: async (id) => {
    try {
      const response = await fetch(
        `/api/journal/${id}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data =
        response.status === 204
          ? null
          : await response.json();

      if (
        response.ok &&
        (!data || data.success)
      ) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        message:
          data?.message ||
          "Failed to delete journal entry.",
      };
    } catch (error) {
      console.error(
        "Error deleting journal:",
        error
      );

      return {
        success: false,
        message:
          "Network error while deleting journal entry.",
      };
    }
  },

// --- Moods ---
fetchMoodsFromBackend: async (filterMood = "", filterDate = "") => {
  try {
    let url = "/api/moods/";
    const params = new URLSearchParams();

    if (filterMood) params.append("mood", filterMood);
    if (filterDate) params.append("date", filterDate);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      return [];
    }

    const moods = Array.isArray(data)
      ? data
      : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.results)
          ? data.results
          : [];

    return moods.map((entry) => {
      let localDate = null;

      if (entry.created_at) {
        const parsedDate = new Date(entry.created_at);

        if (!Number.isNaN(parsedDate.getTime())) {
          const year = parsedDate.getFullYear();
          const month = String(
            parsedDate.getMonth() + 1
          ).padStart(2, "0");
          const day = String(
            parsedDate.getDate()
          ).padStart(2, "0");

          localDate = `${year}-${month}-${day}`;
        }
      }

      return {
        ...entry,
        mood: entry.mood
          ? String(entry.mood).trim().toLowerCase()
          : "",
        score:
          entry.score !== undefined &&
          entry.score !== null
            ? Number(entry.score)
            : null,
        date: localDate,
      };
    });
  } catch (err) {
    console.error("Error fetching moods:", err);
    return [];
  }
},

recordMoodBackend: async (
  mood,
  score = 5,
  note = ""
) => {
  try {
    const response = await fetch("/api/moods/", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        mood,
        score: Number(score),
        note: note || "",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        entry: data.data || data,
        message:
          data.message ||
          "Mood recorded successfully.",
      };
    }

    return {
      success: false,
      message:
        data.message ||
        "Failed to record mood entry.",
    };
  } catch (err) {
    console.error("Error recording mood:", err);

    return {
      success: false,
      message:
        "Network error while logging mood.",
    };
  }
},

updateMoodBackend: async (
  id,
  mood,
  score = 5,
  note = ""
) => {
  try {
    const response = await fetch(
      `/api/moods/${id}/`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          mood: mood
            ? mood.charAt(0).toUpperCase() +
              mood.slice(1).toLowerCase()
            : mood,
          score: Number(score),
          note: note || ""
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        entry: data.data || data,
        message:
          data.message ||
          "Mood updated successfully.",
      };
    }

    return {
      success: false,
      message:
        data.message ||
        "Failed to update mood entry.",
      errors: data.errors || {},
    };

  } catch (err) {
    console.error("Error updating mood:", err);

    return {
      success: false,
      message:
        "Network error while updating mood.",
    };
  }
},

deleteMoodBackend: async (id) => {
  try {
    const response = await fetch(
      `/api/moods/${id}/`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (response.ok || response.status === 204) {
      return {
        success: true,
        message: "Mood deleted successfully.",
      };
    }

    return {
      success: false,
      message: "Failed to delete mood entry.",
    };
  } catch (err) {
    console.error("Error deleting mood:", err);

    return {
      success: false,
      message:
        "Network error while deleting mood.",
    };
  }
},

getMoods: async () => {
  return apiService.fetchMoodsFromBackend();
},

addMood: async (
  mood,
  score,
  tags,
  note
) => {
  return apiService.recordMoodBackend(
    mood,
    score,
    note
  );
},

fetchMoodAnalyticsBackend: async () => {
  try {
    const response = await fetch(
      "/api/moods/analytics/",
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return data;
    }

    console.error(
      "Mood analytics API error:",
      data
    );

    return null;
  } catch (error) {
    console.error(
      "Error fetching mood analytics:",
      error
    );

    return null;
  }
},

  // =========================================================
  // BLOOMBOT / CHATBOT
  // =========================================================

  sendMessage: async (
  chatId,
  messageText,
  history = []
) => {
  try {
    const response = await fetch(
      "/api/chat/",
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message: messageText,
          history,
        }),
      }
    );

    const data = await response.json();

    // ==============================
    // SUCCESS
    // ==============================
    if (response.ok) {
      if (data.chat_count !== undefined) {
        apiService.updateUser({
          chat_count: data.chat_count,
          subscription_type: data.subscription_type,
          subscription_status: data.subscription_status,
        });
      }

      return {
        success: true,
        reply: data.reply,
        text:
          data.reply ||
          data.message ||
          "I'm listening and here with you. 🌸",
        message: data.message,
        error: null,
        limit_reached: Boolean(data.limit_reached),
        chat_count: data.chat_count,
        subscription_type: data.subscription_type,
        subscription_status: data.subscription_status,
        chats_remaining: data.chats_remaining,
      };
    }

    // ==============================
    // CHAT LIMIT REACHED
    // ==============================
    if (data.limit_reached) {
      return {
        success: false,
        message:
          data.message ||
          data.error ||
          data.reply ||
          "🌸 You've reached your free chat limit.",
        error:
          data.message ||
          data.error ||
          data.reply ||
          "🌸 You've reached your free chat limit.",
        text:
          data.reply ||
          "🌸 You've reached your free chat limit.",
        limit_reached: true,
        chat_count: data.chat_count,
        chats_remaining: 0,
      };
    }

    // ==============================
    // BACKEND ERROR
    // ==============================
    return {
      success: false,
      message:
        data.message ||
        data.error ||
        "BloomBot is currently experiencing high load. Please try again in a moment.",
      error:
        data.message ||
        data.error ||
        "BloomBot is currently experiencing high load. Please try again in a moment.",
      text:
        data.message ||
        data.error ||
        "BloomBot is currently experiencing high load. Please try again in a moment.",
      limit_reached: false,
    };

  } catch (error) {
    console.error(
      "Error communicating with BloomBot backend:",
      error
    );

    return {
      success: false,
      message:
        error.message ||
        "Unable to reach MindBloom server.",
      error:
        error.message ||
        "Unable to reach MindBloom server.",
      text:
        "I'm currently unable to reach the MindBloom server. Please check your internet connection.",
      limit_reached: false,
    };
  }
},

  submitBloomBotFeedbackBackend:
    async (feedbackData) => {
      try {
        const response = await fetch(
          "/api/chat/feedback/",
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(feedbackData),
          }
        );

        const data =
          await response.json();

        if (response.ok) {
          return {
            success: true,
            message: data.message,
          };
        }

        return {
          success: false,
          message:
            data.message ||
            "Failed to submit feedback.",
        };
      } catch (error) {
        return {
          success: false,
          message:
            "Network error while submitting feedback.",
        };
      }
    },
retryBloomBotResponseBackend: async (payload) => {
  try {
    const response = await fetch("/api/chat/retry/", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        message: payload?.message || "",
        history: Array.isArray(payload?.history)
          ? payload.history
          : [],
        previous_response: payload?.previous_response || "",
      }),
    });

    const data = await response.json();

    if (response.ok && data.reply) {
      return {
        success: true,
        reply: data.reply,
        message: data.message,
      };
    }

    return {
      success: false,
      message:
        data.message ||
        "BloomBot couldn't regenerate the response.",
    };
  } catch (error) {
    console.error("BloomBot retry API error:", error);

    return {
      success: false,
      message:
        "Network error while regenerating BloomBot's response.",
    };
  }
},

  // =========================================================
  // REFLECTIONS
  // =========================================================

  fetchGratitudeBackend: async (
    dateStr = ""
  ) => {
    try {
      let url =
        "/api/reflection/gratitude/";

      if (dateStr) {
        url += `?date=${encodeURIComponent(
          dateStr
        )}`;
      }

      const response = await fetch(
        url,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        return Array.isArray(data.data)
          ? data.data
          : [];
      }

      console.error(
        "Failed to fetch gratitude:",
        data
      );

      return [];
    } catch (error) {
      console.error(
        "Error fetching gratitude:",
        error
      );

      return [];
    }
  },

  saveGratitudeBackend: async (
    gratitudeData
  ) => {
    try {
      const response = await fetch(
        "/api/reflection/gratitude/",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(
            gratitudeData
          ),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        return {
          success: true,
          entry: data.data,
          message:
            data.message ||
            "Gratitude saved successfully.",
        };
      }

      console.error(
        "Gratitude API error:",
        data
      );

      return {
        success: false,
        message:
          data.message ||
          "Failed to save gratitude reflection.",
        errors: data.errors || {},
      };
    } catch (error) {
      console.error(
        "Error saving gratitude:",
        error
      );

      return {
        success: false,
        message:
          "Network error while saving gratitude reflection.",
      };
    }
  },

  updateGratitudeBackend: async (
    id,
    gratitudeData
  ) => {
    try {
      const response = await fetch(
        `/api/reflection/gratitude/${id}/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(
            gratitudeData
          ),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        return {
          success: true,
          entry: data.data,
          message:
            data.message ||
            "Gratitude updated successfully.",
        };
      }

      console.error(
        "Update gratitude API error:",
        data
      );

      return {
        success: false,
        message:
          data.message ||
          "Failed to update gratitude.",
        errors: data.errors || {},
      };
    } catch (error) {
      console.error(
        "Error updating gratitude:",
        error
      );

      return {
        success: false,
        message:
          "Network error while updating gratitude.",
      };
    }
  },

  fetchSelfTalkBackend: async (
    dateStr = ""
  ) => {
    try {
      let url =
        "/api/reflection/self-talk/";

      if (dateStr) {
        url += `?date=${encodeURIComponent(
          dateStr
        )}`;
      }

      const response = await fetch(
        url,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        return Array.isArray(data.data)
          ? data.data
          : [];
      }

      console.error(
        "Failed to fetch self-talk:",
        data
      );

      return [];
    } catch (error) {
      console.error(
        "Error fetching self-talk:",
        error
      );

      return [];
    }
  },

  saveSelfTalkBackend: async (
    selfTalkData
  ) => {
    try {
      const response = await fetch(
        "/api/reflection/self-talk/",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(
            selfTalkData
          ),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        return {
          success: true,
          entry: data.data,
          message:
            data.message ||
            "Self-talk saved successfully.",
        };
      }

      console.error(
        "Self-talk API error:",
        data
      );

      return {
        success: false,
        message:
          data.message ||
          "Failed to save self-talk entry.",
        errors: data.errors || {},
      };
    } catch (error) {
      console.error(
        "Error saving self-talk:",
        error
      );

      return {
        success: false,
        message:
          "Network error while saving self-talk.",
      };
    }
  },

  updateSelfTalkBackend: async (
    id,
    selfTalkData
  ) => {
    try {
      const response = await fetch(
        `/api/reflection/self-talk/${id}/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(
            selfTalkData
          ),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        return {
          success: true,
          entry: data.data,
          message:
            data.message ||
            "Self-talk updated successfully.",
        };
      }

      console.error(
        "Update self-talk API error:",
        data
      );

      return {
        success: false,
        message:
          data.message ||
          "Failed to update self-talk.",
        errors: data.errors || {},
      };
    } catch (error) {
      console.error(
        "Error updating self-talk:",
        error
      );

      return {
        success: false,
        message:
          "Network error while updating self-talk.",
      };
    }
  },

  getReflections: async (
    dateStr = ""
  ) => {
    return apiService.fetchGratitudeBackend(
      dateStr
    );
  },
  fetchReflectionActivityBackend: async () => {
  try {
    const [gratitudeResponse, selfTalkResponse] =
      await Promise.all([
        fetch("/api/reflection/gratitude/", {
          method: "GET",
          headers: getAuthHeaders(),
        }),
        fetch("/api/reflection/self-talk/", {
          method: "GET",
          headers: getAuthHeaders(),
        }),
      ]);

    const gratitudeData =
      await gratitudeResponse.json();

    const selfTalkData =
      await selfTalkResponse.json();

    const gratitudeEntries =
      gratitudeResponse.ok &&
      gratitudeData.success &&
      Array.isArray(gratitudeData.data)
        ? gratitudeData.data
        : [];

    const selfTalkEntries =
      selfTalkResponse.ok &&
      selfTalkData.success &&
      Array.isArray(selfTalkData.data)
        ? selfTalkData.data
        : [];

    return [
      ...gratitudeEntries,
      ...selfTalkEntries,
    ];
  } catch (error) {
    console.error(
      "Error fetching reflection activity:",
      error
    );

    return [];
  }
},

  saveReflection: async (data) => {
    try {
      const reflectionDate =
        data.date ||
        data.reflection_date;

      if (!reflectionDate) {
        return {
          success: false,
          message:
            "Reflection date is required.",
        };
      }

      const gratitudeEntries =
        Array.isArray(data.gratitude)
          ? data.gratitude
              .map((item) =>
                String(item || "").trim()
              )
              .filter(Boolean)
          : [];

      const results = [];

      // Save each gratitude entry separately
      for (
        const gratitude of gratitudeEntries
      ) {
        const result =
          await apiService.saveGratitudeBackend(
            {
              gratitude,
              reflection_date:
                reflectionDate,
            }
          );

        if (!result.success) {
          return result;
        }

        results.push(result.entry);
      }

      // Save self-talk separately
      const selfTalk = String(
        data.selfTalk || ""
      ).trim();

      if (selfTalk) {
        const selfTalkResult =
          await apiService.saveSelfTalkBackend(
            {
              self_talk: selfTalk,
              reflection_date:
                reflectionDate,
            }
          );

        if (!selfTalkResult.success) {
          return selfTalkResult;
        }

        results.push(
          selfTalkResult.entry
        );
      }

      return {
        success: true,
        entries: results,
        message:
          "Reflection saved successfully.",
      };
    } catch (error) {
      console.error(
        "Error saving reflection:",
        error
      );

      return {
        success: false,
        message:
          "Failed to save reflection.",
      };
    }
  },

  // =========================================================
  // BLOOM STORIES
  // =========================================================

  fetchStoriesFromBackend: async (
    category = "all",
    searchQuery = ""
  ) => {
    try {
      let url = "/api/stories/";

      const params =
        new URLSearchParams();

      if (
        category &&
        category !== "all"
      ) {
        params.append(
          "category",
          category
        );
      }

      if (searchQuery) {
        params.append(
          "search",
          searchQuery
        );
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(
        url,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        return Array.isArray(data.data)
          ? data.data
          : [];
      }

      console.error(
        "Error fetching stories:",
        data
      );

      return [];
    } catch (error) {
      console.error(
        "Error fetching stories:",
        error
      );

      return [];
    }
  },

  createStoryBackend: async (
    storyData
  ) => {
    try {
      const response = await fetch(
        "/api/stories/",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(
            storyData
          ),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        return {
          success: true,
          story: data.data,
          message:
            data.message ||
            "Story shared successfully.",
        };
      }

      console.error(
        "Create story API error:",
        data
      );

      return {
        success: false,
        message:
          data.message ||
          "Failed to create story.",
        errors: data.errors || {},
      };
    } catch (error) {
      console.error(
        "Error creating story:",
        error
      );

      return {
        success: false,
        message:
          "Network error while publishing story.",
      };
    }
  },

  updateStoryBackend: async (
    id,
    storyData
  ) => {
    try {
      const response = await fetch(
        `/api/stories/${id}/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(
            storyData
          ),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        return {
          success: true,
          story: data.data,
          message:
            data.message ||
            "Story updated successfully.",
        };
      }

      console.error(
        "Update story API error:",
        data
      );

      return {
        success: false,
        message:
          data.message ||
          "Failed to update story.",
        errors: data.errors || {},
      };
    } catch (error) {
      console.error(
        "Error updating story:",
        error
      );

      return {
        success: false,
        message:
          "Network error while updating story.",
      };
    }
  },

  deleteStoryBackend: async (id) => {
    try {
      const response = await fetch(
        `/api/stories/${id}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (
        response.ok ||
        response.status === 204
      ) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        message:
          "Failed to delete story.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          "Network error while deleting story.",
      };
    }
  },

  reportStoryBackend: async (
    id,
    reason = ""
  ) => {
    try {
      const response = await fetch(
        `/api/stories/${id}/report/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            reason,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message,
        };
      }

      return {
        success: false,
        message:
          data.message ||
          "Failed to report story.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          "Network error while submitting report.",
      };
    }
  },

  // =========================================================
  // INSPIRE / QUOTES
  // =========================================================

  fetchQuotesFromBackend: async () => {
    try {
      const response = await fetch(
        "/api/inspire/today/",
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return data;
      }

      return null;
    } catch (error) {
      return null;
    }
  },

  // =========================================================
  // SUBSCRIPTIONS & RAZORPAY
  // =========================================================

  fetchSubscriptionStatusBackend:
    async () => {
      try {
        const response =
          await fetch(
            "/api/user/subscription/",
            {
              headers:
                getAuthHeaders(),
            }
          );

        const data =
          await response.json();

        if (
          response.ok &&
          data.data
        ) {
          return data.data;
        }

        return null;
      } catch (error) {
        return null;
      }
    },

  createPaymentOrderBackend:
    async (plan = "monthly") => {
      try {
        const user =
          apiService.getUser();

        const response =
          await fetch(
            "/api/payment/create-order/",
            {
              method: "POST",
              headers:
                getAuthHeaders(),
              body: JSON.stringify({
                plan,
                email: user.email,
              }),
            }
          );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success
        ) {
          return {
            success: true,
            order_id:
              data.order_id,
            key_id:
              data.key_id,
            amount:
              data.amount,
            currency:
              data.currency,
            name: data.name,
            description:
              data.description,
            user_email:
              data.user_email,
          };
        }

        return {
          success: false,
          message:
            data.message ||
            "Failed to generate payment order.",
        };
      } catch (error) {
        console.error(
          "Payment Order Creation Error:",
          error
        );

        return {
          success: false,
          message:
            "Network error while creating payment order.",
        };
      }
    },

  verifyPaymentAndSubscribeBackend:
    async (paymentDetails) => {
      try {
        const user =
          apiService.getUser();

        const response =
          await fetch(
            "/api/payment/verify/",
            {
              method: "POST",
              headers:
                getAuthHeaders(),
              body: JSON.stringify({
                ...paymentDetails,
                email: user.email,
              }),
            }
          );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success
        ) {
          if (data.data) {
            apiService.updateUser({
              chat_count:
                data.data.chat_count,
              subscription_type:
                data.data
                  .subscription_type,
              subscription_status:
                data.data
                  .subscription_status,
              subscription_expiry:
                data.data
                  .subscription_expiry,
            });
          }

          return {
            success: true,
            message:
              data.message,
            data: data.data,
          };
        }

        return {
          success: false,
          message:
            data.message ||
            "Razorpay payment verification failed.",
        };
      } catch (error) {
        console.error(
          "Payment Verification Error:",
          error
        );

        return {
          success: false,
          message:
            "Network error during Razorpay payment verification.",
        };
      }
    },

  /// =========================================================
// ADMIN INSPIRE CONTENT
// =========================================================

  // ---------------------------------------------------------
// ADMIN QUOTES
// ---------------------------------------------------------

fetchAdminQuotesBackend: async () => {
  try {
    const response = await fetch("/api/inspire/quotes/", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    console.log("📚 Admin Quotes API Response:", data);

    if (response.ok && data.success) {
      return {
        success: true,
        data: Array.isArray(data.data) ? data.data : [],
        message: data.message || "Quotes fetched successfully.",
      };
    }

    console.error("❌ Failed to fetch admin quotes:", data);

    return {
      success: false,
      data: [],
      message:
        data.message ||
        data.detail ||
        "Failed to fetch quotes.",
    };
  } catch (error) {
    console.error("❌ Error fetching admin quotes:", error);

    return {
      success: false,
      data: [],
      message: "Network error while fetching quotes.",
    };
  }
},

createAdminQuoteBackend: async (quoteData) => {
  try {
    const response = await fetch("/api/inspire/quotes/", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(quoteData),
    });

    const data = await response.json();

    console.log("📝 Create Quote API Response:", data);

    if (response.ok && data.success) {
      return {
        success: true,
        data: data.data,
        message:
          data.message || "Quote created successfully.",
      };
    }

    return {
      success: false,
      message:
        data.message ||
        data.detail ||
        "Failed to create quote.",
      errors: data.errors || {},
    };
  } catch (error) {
    console.error("❌ Error creating admin quote:", error);

    return {
      success: false,
      message: "Network error while creating quote.",
    };
  }
},

updateAdminQuoteBackend: async (id, quoteData) => {
  try {
    const response = await fetch(
      `/api/inspire/quotes/${id}/`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(quoteData),
      }
    );

    const data = await response.json();

    console.log("✏️ Update Quote API Response:", data);

    if (response.ok && data.success) {
      return {
        success: true,
        data: data.data,
        message:
          data.message || "Quote updated successfully.",
      };
    }

    return {
      success: false,
      message:
        data.message ||
        data.detail ||
        "Failed to update quote.",
      errors: data.errors || {},
    };
  } catch (error) {
    console.error("❌ Error updating admin quote:", error);

    return {
      success: false,
      message: "Network error while updating quote.",
    };
  }
},

deleteAdminQuoteBackend: async (id) => {
  try {
    const response = await fetch(
      `/api/inspire/quotes/${id}/`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (response.ok || response.status === 204) {
      return {
        success: true,
        message: "Quote deleted successfully.",
      };
    }

    let data = {};

    try {
      data = await response.json();
    } catch {
      // Empty response
    }

    return {
      success: false,
      message:
        data.message ||
        data.detail ||
        "Failed to delete quote.",
    };
  } catch (error) {
    console.error("❌ Error deleting admin quote:", error);

    return {
      success: false,
      message: "Network error while deleting quote.",
    };
  }
},


  // ---------------------------------------------------------
  // ADMIN ARTICLES
  // ---------------------------------------------------------

  fetchAdminArticlesBackend: async () => {
    try {
      const response = await fetch(
        "/api/admin/inspire/articles/",
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: Array.isArray(data)
            ? data
            : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.results)
            ? data.results
            : [],
        };
      }

      return {
        success: false,
        data: [],
        message:
          data.message ||
          data.detail ||
          "Failed to fetch articles.",
      };
    } catch (error) {
      console.error(
        "Error fetching admin articles:",
        error
      );

      return {
        success: false,
        data: [],
        message:
          "Network error while fetching articles.",
      };
    }
  },

  createAdminArticleBackend: async (
    articleData
  ) => {
    try {
      const response = await fetch(
        "/api/admin/inspire/articles/",
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(articleData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.data || data,
          message:
            data.message ||
            "Article created successfully.",
        };
      }

      return {
        success: false,
        message:
          data.message ||
          data.detail ||
          "Failed to create article.",
        errors: data.errors || {},
      };
    } catch (error) {
      console.error(
        "Error creating admin article:",
        error
      );

      return {
        success: false,
        message:
          "Network error while creating article.",
      };
    }
  },

  updateAdminArticleBackend: async (
    id,
    articleData
  ) => {
    try {
      const response = await fetch(
        `/api/admin/inspire/articles/${id}/`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(articleData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.data || data,
          message:
            data.message ||
            "Article updated successfully.",
        };
      }

      return {
        success: false,
        message:
          data.message ||
          data.detail ||
          "Failed to update article.",
        errors: data.errors || {},
      };
    } catch (error) {
      console.error(
        "Error updating admin article:",
        error
      );

      return {
        success: false,
        message:
          "Network error while updating article.",
      };
    }
  },

  deleteAdminArticleBackend: async (id) => {
    try {
      const response = await fetch(
        `/api/admin/inspire/articles/${id}/`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (
        response.ok ||
        response.status === 204
      ) {
        return {
          success: true,
          message:
            "Article deleted successfully.",
        };
      }

      let data = {};

      try {
        data = await response.json();
      } catch {
        // Empty response
      }

      return {
        success: false,
        message:
          data.message ||
          data.detail ||
          "Failed to delete article.",
      };
    } catch (error) {
      console.error(
        "Error deleting admin article:",
        error
      );

      return {
        success: false,
        message:
          "Network error while deleting article.",
      };
    }
  },

  reactivateUserBackend:
    async (id) => {
      try {
        const response =
          await fetch(
            `/api/admin/users/${id}/reactivate/`,
            {
              method: "POST",
              headers:
                getAuthHeaders(),
            }
          );

        const data =
          await response.json();

        if (response.ok) {
          return {
            success: true,
            message:
              data.message,
          };
        }

        return {
          success: false,
          message:
            data.message ||
            "Failed to reactivate user.",
        };
      } catch (error) {
        return {
          success: false,
          message:
            "Network error.",
        };
      }
    },

  fetchBloomBotAdminInsightsBackend:
    async () => {
      try {
        const response =
          await fetch(
            "/api/admin/bloombot-feedback/",
            {
              headers:
                getAuthHeaders(),
            }
          );

        const data =
          await response.json();

        if (
          response.ok &&
          data.data
        ) {
          return data.data;
        }

        return null;
      } catch (error) {
        return null;
      }
    },

  // =========================================================
  // ADDITIONAL / AUDIT METHODS
  // =========================================================

  getArticles: async () => {
    try {
      const response =
        await fetch(
          "/api/inspire/articles/",
          {
            headers:
              getAuthHeaders(),
          }
        );

      const data =
        await response.json();

      if (response.ok) {
        return data.success &&
          Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
      }

      return [];
    } catch (error) {
      console.error(
        "Error fetching articles:",
        error
      );

      return [];
    }
  },

  getAdminUsers: async () => {
    try {
      const response =
        await fetch(
          "/api/admin/users/",
          {
            headers:
              getAuthHeaders(),
          }
        );

      const data =
        await response.json();

      if (response.ok) {
        return data.success &&
          Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
      }

      return [];
    } catch (error) {
      console.error(
        "Error fetching admin users:",
        error
      );

      return [];
    }
  },

  toggleUserStatus: async (
    id,
    isCurrentlyActive = true
  ) => {
    if (isCurrentlyActive) {
      return apiService.suspendUserBackend(
        id
      );
    }

    return apiService.reactivateUserBackend(
      id
    );
  },

  getConversations: async () => {
    try {
      const response =
        await fetch(
          "/api/admin/bloombot-feedback/",
          {
            headers:
              getAuthHeaders(),
          }
        );

      const data =
        await response.json();

      if (response.ok) {
        return data.success &&
          Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
      }

      return [];
    } catch (error) {
      console.error(
        "Error fetching conversations:",
        error
      );

      return [];
    }
  },

  getQuotes: async () => {
    try {
      const response =
        await fetch(
          "/api/inspire/quotes/",
          {
            headers:
              getAuthHeaders(),
          }
        );

      const data =
        await response.json();

      if (response.ok) {
        return data.success &&
          Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
      }

      return [];
    } catch (error) {
      console.error(
        "Error fetching quotes:",
        error
      );

      return [];
    }
  },

  toggleSaveQuote: async (
    id
  ) => {
    try {
      const response =
        await fetch(
          `/api/inspire/quotes/${id}/`,
          {
            method: "PATCH",
            headers:
              getAuthHeaders(),
            body: JSON.stringify({
              is_saved: true,
            }),
          }
        );

      return response.ok;
    } catch (error) {
      console.error(
        "Error toggling quote save status:",
        error
      );

      return false;
    }
  },

  getStories: async () => {
    return apiService.fetchStoriesFromBackend();
  },

  getTestimonials: async () => {
    try {
      const response =
        await fetch(
          "/api/testimonials/",
          {
            headers:
              getAuthHeaders(),
          }
        );

      const data =
        await response.json();

      if (
        response.ok &&
        data.success
      ) {
        return Array.isArray(
          data.data
        )
          ? data.data
          : [];
      }

      return [];
    } catch (error) {
      console.error(
        "Error fetching testimonials:",
        error
      );

      return [];
    }
  },

  addTestimonial: async (
    testimonialData
  ) => {
    try {
      const response =
        await fetch(
          "/api/testimonials/",
          {
            method: "POST",
            headers:
              getAuthHeaders(),
            body: JSON.stringify(
              testimonialData
            ),
          }
        );

      const data =
        await response.json();

      const isSuccess =
        response.ok &&
        data.success === true;

      let errorMessage =
        data.message ||
        "Failed to record review.";

      if (
        !isSuccess &&
        data.errors
      ) {
        errorMessage =
          Object.entries(
            data.errors
          )
            .map(
              ([key, value]) =>
                `${key}: ${
                  Array.isArray(value)
                    ? value.join(", ")
                    : value
                }`
            )
            .join(" | ");
      }

      return {
        success: isSuccess,
        data: data.data || null,
        message: errorMessage,
      };
    } catch (error) {
      console.error(
        "Error adding testimonial:",
        error
      );

      return {
        success: false,
        message:
          error.message ||
          "Network request failed.",
      };
    }
  },

  // =========================================================
  // FAQ
  // =========================================================

  getFAQs: () => [
    {
      id: "f-1",
      question: "What is MindBloom?",
      answer:
        "MindBloom is a compassionate mental health companion featuring AI support with BloomBot, mood tracking, reflective journaling, and inspiring community stories.",
    },
    {
      id: "f-2",
      question:
        "Is my data private and secure?",
      answer:
        "Yes! All personal journals, mood logs, and reflections are stored securely. We never share or sell your data.",
    },
    {
      id: "f-3",
      question:
        "How does MindBloom Premium work?",
      answer:
        "MindBloom Premium unlocks unlimited BloomBot conversations and advanced AI insights. Subscriptions are verified securely via Razorpay.",
    },
    {
      id: "f-4",
      question:
        "Can I use MindBloom for free?",
      answer:
        "Yes. MindBloom provides full access to journaling, mood tracking, community stories, and daily inspiration completely free.",
    },
  ],

  // =========================================================
  // AI AVATAR
  // =========================================================

  generateAiAvatar: async (
    keyword = "MindBloom"
  ) => {
    return `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(
      keyword
    )}&backgroundColor=efe6dc`;
  },

  // =========================================================
  // COMPATIBILITY HELPERS
  // =========================================================

  getMoods: async () => {
    return apiService.fetchMoodsFromBackend();
  },

  addMood: async (
    mood,
    score,
    tags,
    note
  ) => {
    return apiService.recordMoodBackend(
      mood,
      note
    );
  },

  deleteJournal: async (
    id
  ) => {
    return apiService.deleteJournalEntryBackend(
      id
    );
  },

  toggleFavoriteJournal: async (
    id
  ) => {
    return {
      success: true,
    };
  },

  regenerateMessageBackend:
    async (
      messageText,
      historyContext = []
    ) => {
      return apiService.retryBloomBotResponseBackend(
        {
          message: messageText,
          history: historyContext,
        }
      );
    },
};