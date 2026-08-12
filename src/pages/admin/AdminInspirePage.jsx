import { useState, useEffect } from "react";
import {
  Quote,
  Sparkles,
  FileText,
  Mail,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../services/apiService";

export const AdminInspirePage = () => {
  const { addToast } = useAuth();

  const [activeTab, setActiveTab] = useState("quotes");

  const [quotes, setQuotes] = useState([]);
  const [affirmations, setAffirmations] = useState([]);
  const [articles, setArticles] = useState([]);
  const [newsletters, setNewsletters] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // -------------------------------------------------------
  // API HELPER
  // -------------------------------------------------------
  const getAuthHeaders = () => {
    const token = apiService.getAccessToken();

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // -------------------------------------------------------
  // LOAD DATA FROM DATABASE
  // -------------------------------------------------------
  const loadData = async () => {
    setLoading(true);

    try {
      const requests = await Promise.allSettled([
        fetch("/api/inspire/quotes/"),
        fetch("/api/inspire/affirmations/"),
        fetch("/api/inspire/articles/"),
        fetch("/api/inspire/newsletters/"),
      ]);

      // ---------------- QUOTES ----------------
      if (requests[0].status === "fulfilled") {
        const response = requests[0].value;

        if (response.ok) {
          const data = await response.json();

          const quoteData = Array.isArray(data)
            ? data
            : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.results)
            ? data.results
            : [];

          setQuotes(quoteData);
        }
      }

      // ---------------- AFFIRMATIONS ----------------
      if (requests[1].status === "fulfilled") {
        const response = requests[1].value;

        if (response.ok) {
          const data = await response.json();

          const affirmationData = Array.isArray(data)
            ? data
            : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.results)
            ? data.results
            : [];

          setAffirmations(affirmationData);
        }
      }

      // ---------------- ARTICLES ----------------
      if (requests[2].status === "fulfilled") {
        const response = requests[2].value;

        if (response.ok) {
          const data = await response.json();

          const articleData = Array.isArray(data)
            ? data
            : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.results)
            ? data.results
            : [];

          setArticles(articleData);
        }
      }

      // ---------------- NEWSLETTERS ----------------
      if (requests[3].status === "fulfilled") {
        const response = requests[3].value;

        if (response.ok) {
          const data = await response.json();

          const newsletterData = Array.isArray(data)
            ? data
            : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.results)
            ? data.results
            : [];

          setNewsletters(newsletterData);
        }
      }
    } catch (error) {
      console.error("Error loading Inspire data:", error);

      addToast(
        "Unable to load content",
        "Could not connect to the MindBloom database.",
        "warning"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -------------------------------------------------------
  // TABS
  // -------------------------------------------------------
  const tabs = [
    {
      id: "quotes",
      label: "Quotes",
      singular: "Quote",
      icon: Quote,
      count: quotes.length,
    },
    {
      id: "affirmations",
      label: "Affirmations",
      singular: "Affirmation",
      icon: Sparkles,
      count: affirmations.length,
    },
    {
      id: "articles",
      label: "Articles",
      singular: "Article",
      icon: FileText,
      count: articles.length,
    },
    {
      id: "newsletters",
      label: "Newsletters",
      singular: "Newsletter",
      icon: Mail,
      count: newsletters.length,
    },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  // -------------------------------------------------------
  // OPEN CREATE MODAL
  // -------------------------------------------------------
  const openCreateModal = () => {
    setEditingItem(null);

    if (activeTab === "quotes") {
      setFormData({
        text: "",
        author: "",
        category: "",
      });
    }

    if (activeTab === "affirmations") {
      setFormData({
        text: "",
        category: "",
      });
    }

    if (activeTab === "articles") {
      setFormData({
        title: "",
        summary: "",
        content: "",
        category: "",
        author: "",
      });
    }

    if (activeTab === "newsletters") {
      setFormData({
        title: "",
        summary: "",
        content: "",
      });
    }

    setIsModalOpen(true);
  };

  // -------------------------------------------------------
  // OPEN EDIT MODAL
  // -------------------------------------------------------
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // -------------------------------------------------------
  // CLOSE MODAL
  // -------------------------------------------------------
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  // -------------------------------------------------------
  // SAVE - CREATE OR UPDATE
  // -------------------------------------------------------
  const handleSave = async (e) => {
    e.preventDefault();

    const isEdit = Boolean(editingItem);

    const endpoint = isEdit
      ? `/api/inspire/${activeTab}/${editingItem.id}/`
      : `/api/inspire/${activeTab}/`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const token = apiService.getAccessToken();

      if (!token) {
        addToast(
          "Authentication required",
          "Your login session is missing. Please log in again.",
          "warning"
        );
        return;
      }

      console.log("Saving Inspire content...");
      console.log("Endpoint:", endpoint);
      console.log("Method:", method);

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      console.log("Save response:", response.status, data);

      if (!response.ok) {
        addToast(
          "Unable to save",
          data.detail ||
            data.message ||
            "You do not have permission to perform this action.",
          "warning"
        );
        return;
      }

      addToast(
        isEdit ? "Updated successfully! ✨" : "Created successfully! ✨",
        isEdit
          ? "The content has been updated in the MindBloom database."
          : "New content has been added to the MindBloom database.",
        "success"
      );

      closeModal();
      await loadData();
    } catch (error) {
      console.error("Save request error:", error);

      addToast(
        "Unable to save",
        "Something went wrong while communicating with the server.",
        "warning"
      );
    }
  };

  // -------------------------------------------------------
  // DELETE
  // -------------------------------------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) return;

    try {
      const token = apiService.getAccessToken();

      if (!token) {
        addToast(
          "Authentication required",
          "Your login session is missing. Please log in again.",
          "warning"
        );
        return;
      }

      const endpoint = `/api/inspire/${activeTab}/${id}/`;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        addToast(
          "Unable to delete",
          data.detail ||
            data.message ||
            "You do not have permission to perform this action.",
          "warning"
        );
        return;
      }

      addToast(
        "Deleted successfully",
        "The content has been removed from the MindBloom database.",
        "success"
      );

      await loadData();
    } catch (error) {
      console.error("Delete request error:", error);

      addToast(
        "Unable to delete",
        "Something went wrong while deleting the content.",
        "warning"
      );
    }
  };

  // -------------------------------------------------------
  // CURRENT DATA
  // -------------------------------------------------------
  const getCurrentData = () => {
    if (activeTab === "quotes") return quotes;
    if (activeTab === "affirmations") return affirmations;
    if (activeTab === "articles") return articles;
    if (activeTab === "newsletters") return newsletters;

    return [];
  };

  const currentData = getCurrentData();

  // -------------------------------------------------------
  // SEARCH
  // -------------------------------------------------------
  const filteredData = currentData.filter((item) => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return true;

    return Object.values(item || {}).some((value) =>
      String(value || "").toLowerCase().includes(query)
    );
  });

  // -------------------------------------------------------
  // EMPTY STATE
  // -------------------------------------------------------
  const EmptyState = () => {
    const Icon = currentTab?.icon || Sparkles;

    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FBEBE6] dark:bg-[#38261F] flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-[#E07A5F]" />
        </div>

        <h3 className="font-serif font-bold text-lg text-[#3B281C] dark:text-[#FFFBF7]">
          No {currentTab?.label.toLowerCase()} found
        </h3>

        <p className="text-xs text-[#8C7667] mt-1">
          Add your first {currentTab?.singular.toLowerCase()} to MindBloom.
        </p>

        <button
          onClick={openCreateModal}
          className="cozy-btn-primary text-xs py-2.5 px-5 mt-5 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add {currentTab?.singular}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#3B281C] dark:text-[#FFFBF7]">
            Inspire
          </h1>

          <p className="text-sm text-[#705D52] dark:text-[#D4C3B3] mt-1">
            Manage inspirational quotes, positive affirmations, wellness
            articles, and Bloom letters.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="cozy-btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add {currentTab?.singular}
        </button>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                isActive
                  ? "bg-[#E07A5F] text-[#FFFBF7] shadow-md"
                  : "bg-[#FFFBF7] dark:bg-[#251E19] text-[#705D52] dark:text-[#D4C3B3] border border-[#E6DCCD] dark:border-[#3D3128] hover:border-[#E07A5F]/50"
              }`}
            >
              <Icon className="w-4 h-4" />

              <span>{tab.label}</span>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive
                    ? "bg-[#FFFBF7]/20 text-[#FFFBF7]"
                    : "bg-[#EFE6DC] dark:bg-[#3D3128] text-[#705D52]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* SEARCH + REFRESH */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7667]" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${currentTab?.label.toLowerCase()}...`}
            className="cozy-input w-full pl-11"
          />
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#E6DCCD] dark:border-[#3D3128] bg-[#FFFBF7] dark:bg-[#251E19] text-[#705D52] dark:text-[#D4C3B3] hover:border-[#E07A5F] transition flex items-center justify-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />

          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* CONTENT CARD */}
      <div className="cozy-card p-6 bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128]">
        {/* LOADING */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-7 h-7 text-[#E07A5F] animate-spin mx-auto mb-3" />

            <p className="text-xs text-[#8C7667]">
              Loading content from MindBloom database...
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {/* QUOTES */}
            {activeTab === "quotes" &&
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[#3B281C] dark:text-[#FFFBF7] italic">
                      "{item.text}"
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8C7667]">
                      <span>— {item.author || "Unknown"}</span>

                      {item.category && (
                        <span className="px-2 py-1 rounded-md bg-[#EAEFE6] text-[#4F5D3D] text-[10px] font-semibold">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl bg-[#FFFBF7] dark:bg-[#251E19] text-[#705D52] hover:text-[#E07A5F] border border-[#E6DCCD] dark:border-[#3D3128] transition"
                      title="Edit quote"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-[#FBEBE6] text-[#B8543B] hover:bg-[#F4CFC5] transition"
                      title="Delete quote"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

            {/* AFFIRMATIONS */}
            {activeTab === "affirmations" &&
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[#3B281C] dark:text-[#FFFBF7]">
                      ✨ {item.text}
                    </p>

                    {item.category && (
                      <span className="inline-block px-2 py-1 rounded-md bg-[#EAEFE6] text-[#4F5D3D] text-[10px] font-semibold">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl bg-[#FFFBF7] dark:bg-[#251E19] text-[#705D52] hover:text-[#E07A5F] border border-[#E6DCCD] dark:border-[#3D3128] transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-[#FBEBE6] text-[#B8543B] hover:bg-[#F4CFC5] transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

            {/* ARTICLES */}
            {activeTab === "articles" &&
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-base text-[#3B281C] dark:text-[#FFFBF7]">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#705D52] dark:text-[#D4C3B3]">
                      {item.summary ||
                        (item.content
                          ? `${item.content.slice(0, 150)}...`
                          : "No summary available.")}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#8C7667]">
                      <span>
                        Author: {item.author || "MindBloom Editorial"}
                      </span>

                      {item.category && (
                        <>
                          <span>•</span>
                          <span>Category: {item.category}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl bg-[#FFFBF7] dark:bg-[#251E19] text-[#705D52] hover:text-[#E07A5F] border border-[#E6DCCD] dark:border-[#3D3128] transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-[#FBEBE6] text-[#B8543B] hover:bg-[#F4CFC5] transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

            {/* NEWSLETTERS */}
            {activeTab === "newsletters" &&
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#2F2620] border border-[#E6DCCD] dark:border-[#3D3128] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-base text-[#3B281C] dark:text-[#FFFBF7]">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#705D52] dark:text-[#D4C3B3]">
                      {item.summary || "No summary available."}
                    </p>

                    <p className="text-[10px] text-[#8C7667]">
                      Published: {item.published_date || "Not published yet"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl bg-[#FFFBF7] dark:bg-[#251E19] text-[#705D52] hover:text-[#E07A5F] border border-[#E6DCCD] dark:border-[#3D3128] transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-[#FBEBE6] text-[#B8543B] hover:bg-[#F4CFC5] transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFBF7] dark:bg-[#251E19] border border-[#E6DCCD] dark:border-[#3D3128] rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E6DCCD] dark:border-[#3D3128] pb-4 mb-5">
              <div>
                <h2 className="font-serif font-bold text-xl text-[#3B281C] dark:text-[#FFFBF7]">
                  {editingItem ? "Edit" : "Add"} {currentTab?.singular}
                </h2>

                <p className="text-xs text-[#8C7667] mt-1">
                  {editingItem
                    ? "Update this content in the MindBloom database."
                    : "Add new content to the MindBloom database."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg text-[#8C7667] hover:text-[#3B281C] dark:hover:text-[#FFFBF7]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* QUOTE FORM */}
              {activeTab === "quotes" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Quote
                    </label>

                    <textarea
                      required
                      rows={4}
                      value={formData.text || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          text: e.target.value,
                        })
                      }
                      className="cozy-input w-full resize-none"
                      placeholder="Enter an inspirational quote..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Author
                    </label>

                    <input
                      type="text"
                      value={formData.author || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: e.target.value,
                        })
                      }
                      className="cozy-input w-full"
                      placeholder="Enter author name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Category
                    </label>

                    <input
                      type="text"
                      value={formData.category || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      className="cozy-input w-full"
                      placeholder="e.g. Self-Compassion"
                    />
                  </div>
                </>
              )}

              {/* AFFIRMATION FORM */}
              {activeTab === "affirmations" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Affirmation
                    </label>

                    <textarea
                      required
                      rows={4}
                      value={formData.text || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          text: e.target.value,
                        })
                      }
                      className="cozy-input w-full resize-none"
                      placeholder="Enter a positive affirmation..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Category
                    </label>

                    <input
                      type="text"
                      value={formData.category || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      className="cozy-input w-full"
                      placeholder="e.g. Confidence"
                    />
                  </div>
                </>
              )}

              {/* ARTICLE FORM */}
              {activeTab === "articles" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Title
                    </label>

                    <input
                      required
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value,
                        })
                      }
                      className="cozy-input w-full"
                      placeholder="Article title"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Summary
                    </label>

                    <textarea
                      rows={3}
                      value={formData.summary || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          summary: e.target.value,
                        })
                      }
                      className="cozy-input w-full resize-none"
                      placeholder="Short article summary..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Content
                    </label>

                    <textarea
                      required
                      rows={7}
                      value={formData.content || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          content: e.target.value,
                        })
                      }
                      className="cozy-input w-full resize-none"
                      placeholder="Write article content..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Author
                    </label>

                    <input
                      type="text"
                      value={formData.author || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: e.target.value,
                        })
                      }
                      className="cozy-input w-full"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Category
                    </label>

                    <input
                      type="text"
                      value={formData.category || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      className="cozy-input w-full"
                      placeholder="e.g. Wellness"
                    />
                  </div>
                </>
              )}

              {/* NEWSLETTER FORM */}
              {activeTab === "newsletters" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Title
                    </label>

                    <input
                      required
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: e.target.value,
                        })
                      }
                      className="cozy-input w-full"
                      placeholder="Newsletter title"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Summary
                    </label>

                    <textarea
                      rows={3}
                      value={formData.summary || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          summary: e.target.value,
                        })
                      }
                      className="cozy-input w-full resize-none"
                      placeholder="Short summary..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C3D2E] dark:text-[#D4C3B3] mb-2">
                      Content
                    </label>

                    <textarea
                      rows={7}
                      value={formData.content || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          content: e.target.value,
                        })
                      }
                      className="cozy-input w-full resize-none"
                      placeholder="Write newsletter content..."
                    />
                  </div>
                </>
              )}

              {/* MODAL BUTTONS */}
              <div className="flex justify-end gap-3 border-t border-[#E6DCCD] dark:border-[#3D3128] pt-5 mt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#EFE6DC] dark:bg-[#332A24] text-[#705D52] dark:text-[#D4C3B3] hover:opacity-80 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cozy-btn-primary text-xs py-2.5 px-5 flex items-center gap-2"
                >
                  {editingItem ? (
                    <>
                      <Pencil className="w-3.5 h-3.5" />
                      Update
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};