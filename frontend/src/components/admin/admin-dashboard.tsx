"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  cancelBooking,
  createCategory,
  createDestination,
  createPost,
  createTour,
  createTourSchedule,
  deleteAdminUser,
  deleteCategory,
  deleteDestination,
  deletePost,
  deleteReview,
  deleteTour,
  deleteTourSchedule,
  getAdminBookings,
  getAdminCategories,
  getAdminContactRequests,
  getAdminDestinations,
  getAdminPosts,
  getAdminReviews,
  getAdminTourSchedules,
  getAdminTours,
  getAdminUsers,
  getDashboardSummary,
  getRevenueByMonth,
  getTopTours,
  updateAdminUser,
  updateBookingStatus,
  updateCategory,
  updateContactRequest,
  updateDestination,
  updatePost,
  updateReview,
  updateTour,
  updateTourSchedule,
  uploadAdminImage,
  uploadAdminImages,
  type CategoryPayload,
  type DestinationPayload,
  type PostPayload,
  type TourPayload,
  type TourSchedulePayload,
} from "@/lib/api/admin";
import type {
  Booking,
  Category,
  ContactRequest,
  DashboardSummary,
  Destination,
  Post,
  RevenueByMonth,
  Review,
  TopTour,
  Tour,
  TourImage,
  TourSchedule,
  User,
} from "@/lib/api/types";
import { clearAuth, getStoredAuth, type StoredAuth } from "@/lib/auth-storage";
import { formatCurrency, formatDate } from "@/lib/format";

type Section =
  | "overview"
  | "users"
  | "destinations"
  | "categories"
  | "tours"
  | "schedules"
  | "bookings"
  | "reviews"
  | "posts"
  | "contacts";

const sections: { id: Section; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "destinations", label: "Destinations" },
  { id: "categories", label: "Categories" },
  { id: "tours", label: "Tours" },
  { id: "schedules", label: "Schedules" },
  { id: "bookings", label: "Bookings" },
  { id: "reviews", label: "Reviews" },
  { id: "posts", label: "Posts" },
  { id: "contacts", label: "Contact Requests" },
];

const statusOptions = {
  content: ["ACTIVE", "INACTIVE"],
  tour: ["ACTIVE", "INACTIVE", "DRAFT"],
  schedule: ["OPEN", "CLOSED", "CANCELLED"],
  booking: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
  payment: ["UNPAID", "PAID", "FAILED", "REFUNDED"],
  review: ["VISIBLE", "HIDDEN"],
  post: ["DRAFT", "PUBLISHED", "HIDDEN"],
  contact: ["NEW", "PROCESSING", "DONE"],
  userRole: ["ADMIN", "USER"],
  userStatus: ["ACTIVE", "INACTIVE", "BANNED"],
};

const emptyDestination: DestinationPayload = {
  name: "",
  slug: "",
  description: "",
  image: "",
  status: "ACTIVE",
};

const emptyCategory: CategoryPayload = {
  name: "",
  slug: "",
  description: "",
  status: "ACTIVE",
};

const emptyTour: TourPayload = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  destinationId: 0,
  categoryId: 0,
  priceAdult: 0,
  priceChild: 0,
  durationDays: 1,
  durationNights: 0,
  departureLocation: "",
  transport: "",
  maxPeople: 1,
  status: "DRAFT",
  images: [],
};

const emptySchedule: TourSchedulePayload = {
  tourId: 0,
  startDate: "",
  endDate: "",
  availableSeats: 1,
  bookedSeats: 0,
  priceAdult: 0,
  priceChild: 0,
  status: "OPEN",
};

const emptyPost: PostPayload = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnail: "",
  status: "DRAFT",
};

function cleanObject<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== "" && item !== undefined)
  ) as T;
}

function toDateInput(value?: string) {
  return value ? value.slice(0, 10) : "";
}

function toImagesInput(images?: TourImage[]) {
  return (images || [])
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((image) => image.url)
    .join("\n");
}

function parseImagesInput(value: string): TourImage[] {
  return value
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean)
    .map((url, index) => ({
      url,
      isThumbnail: index === 0,
      sortOrder: index,
    }));
}

function confirmDelete(label: string) {
  return window.confirm(`Delete ${label}? This action will use the admin delete endpoint.`);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-11 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-3 text-sm font-semibold text-[#0c3144] outline-none focus:border-[#0ea5e9]"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-24 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-3 py-3 text-sm font-semibold text-[#0c3144] outline-none focus:border-[#0ea5e9]"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-11 w-full rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-3 text-sm font-semibold text-[#0c3144] outline-none focus:border-[#0ea5e9]"
    />
  );
}

function Button({
  tone = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "bg-[#ef4444] text-white hover:bg-[#dc2626]"
      : tone === "secondary"
        ? "border border-[#d7edf4] bg-white text-[#0e7490] hover:bg-[#f0f9ff]"
        : "bg-[#f97316] text-white hover:bg-[#ea580c]";

  return (
    <button
      {...props}
      className={`inline-flex h-10 cursor-pointer items-center justify-center rounded-[8px] px-4 text-sm font-black transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`}
    />
  );
}

function UploadButton({
  label,
  multiple,
  onUpload,
}: {
  label: string;
  multiple?: boolean;
  onUpload: (files: File[]) => void;
}) {
  return (
    <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[8px] border border-[#d7edf4] bg-white px-4 text-sm font-black text-[#0e7490] transition-colors hover:bg-[#f0f9ff]">
      {label}
      <input
        accept="image/gif,image/jpeg,image/png,image/webp"
        className="sr-only"
        multiple={multiple}
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          if (files.length > 0) {
            onUpload(files);
          }
          event.target.value = "";
        }}
        type="file"
      />
    </label>
  );
}

function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function runCommand(command: string, commandValue?: string) {
    document.execCommand(command, false, commandValue);
    editorRef.current?.focus();
    onChange(editorRef.current?.innerHTML || "");
  }

  function createLink() {
    const url = window.prompt("Paste a URL");
    if (url) {
      runCommand("createLink", url);
    }
  }

  const toolbar = [
    ["Bold", "bold"],
    ["Italic", "italic"],
    ["Underline", "underline"],
    ["Quote", "formatBlock", "blockquote"],
    ["H2", "formatBlock", "h2"],
    ["H3", "formatBlock", "h3"],
    ["Bullets", "insertUnorderedList"],
    ["Numbers", "insertOrderedList"],
  ] as const;

  return (
    <div className="rounded-[8px] border border-[#d7edf4] bg-white">
      <div className="flex flex-wrap gap-2 border-b border-[#e3f2f7] p-2">
        {toolbar.map(([label, command, commandValue]) => (
          <button
            className="h-9 rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-3 text-xs font-black text-[#0e7490] hover:bg-[#f0f9ff]"
            key={label}
            onClick={() => runCommand(command, commandValue)}
            type="button"
          >
            {label}
          </button>
        ))}
        <button
          className="h-9 rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-3 text-xs font-black text-[#0e7490] hover:bg-[#f0f9ff]"
          onClick={createLink}
          type="button"
        >
          Link
        </button>
        <button
          className="h-9 rounded-[8px] border border-[#d7edf4] bg-[#f8fdff] px-3 text-xs font-black text-[#0e7490] hover:bg-[#f0f9ff]"
          onClick={() => runCommand("removeFormat")}
          type="button"
        >
          Clear
        </button>
      </div>
      <div
        className="rich-content min-h-72 rounded-b-[8px] bg-[#f8fdff] px-4 py-3 outline-none focus:bg-white"
        contentEditable
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        ref={editorRef}
        suppressContentEditableWarning
      />
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-[#dff3fa] bg-white p-5 shadow-[0_18px_45px_rgba(12,74,110,0.08)]">
      <h2 className="text-2xl font-black text-[#062f42]">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm font-semibold leading-6 text-[#496779]">
          {description}
        </p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Table({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-[#e3f2f7]">
      <table className="min-w-full divide-y divide-[#e3f2f7] text-left text-sm">
        <thead className="bg-[#f8fdff] text-xs font-black uppercase tracking-[0.12em] text-[#64748b]">
          <tr>
            {headers.map((header) => (
              <th className="px-4 py-3" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e3f2f7] bg-white font-semibold text-[#496779]">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function AdminDashboard() {
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [section, setSection] = useState<Section>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenueByMonth[]>([]);
  const [topTours, setTopTours] = useState<TopTour[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [schedules, setSchedules] = useState<TourSchedule[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);

  const [editingDestinationId, setEditingDestinationId] = useState<number | null>(null);
  const [destinationForm, setDestinationForm] = useState<DestinationPayload>(emptyDestination);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryPayload>(emptyCategory);
  const [editingTourId, setEditingTourId] = useState<number | null>(null);
  const [tourForm, setTourForm] = useState<TourPayload>(emptyTour);
  const [tourImagesInput, setTourImagesInput] = useState("");
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
  const [scheduleForm, setScheduleForm] = useState<TourSchedulePayload>(emptySchedule);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [postForm, setPostForm] = useState<PostPayload>(emptyPost);

  const token = auth?.accessToken || "";

  const tourLookup = useMemo(
    () => new Map(tours.map((tour) => [tour.id, tour.title])),
    [tours]
  );

  async function loadAdminData(accessToken: string) {
    setLoading(true);
    setError("");

    try {
      const currentYear = new Date().getFullYear();
      const [
        summaryData,
        revenueData,
        topTourData,
        userData,
        destinationData,
        categoryData,
        tourData,
        scheduleData,
        bookingData,
        reviewData,
        postData,
        contactData,
      ] = await Promise.all([
        getDashboardSummary({ token: accessToken }),
        getRevenueByMonth(currentYear, { token: accessToken }),
        getTopTours(5, { token: accessToken }),
        getAdminUsers({ token: accessToken }),
        getAdminDestinations({ token: accessToken }),
        getAdminCategories({ token: accessToken }),
        getAdminTours(accessToken),
        getAdminTourSchedules({ token: accessToken }),
        getAdminBookings({ token: accessToken }),
        getAdminReviews({ token: accessToken }),
        getAdminPosts(accessToken),
        getAdminContactRequests({ token: accessToken }),
      ]);

      setSummary(summaryData);
      setRevenue(revenueData);
      setTopTours(topTourData);
      setUsers(userData);
      setDestinations(destinationData);
      setCategories(categoryData);
      setTours(tourData.items);
      setSchedules(scheduleData);
      setBookings(bookingData);
      setReviews(reviewData);
      setPosts(postData.items);
      setContacts(contactData);
    } catch {
      setError("Unable to load admin data. Check your admin account and backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = getStoredAuth();
    setAuth(stored);

    if (!stored || stored.user.role !== "ADMIN") {
      setLoading(false);
      return;
    }

    void loadAdminData(stored.accessToken);
  }, []);

  async function runAction(action: () => Promise<unknown>, message: string) {
    if (!token) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await action();
      setSuccess(message);
      await loadAdminData(token);
    } catch {
      setError("Action failed. Check the input data and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadSingleImage(
    file: File,
    folder: string,
    onUploaded: (url: string) => void
  ) {
    if (!token) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const uploaded = await uploadAdminImage(file, token, folder);
      onUploaded(uploaded.secureUrl || uploaded.url);
      setSuccess("Image uploaded.");
    } catch {
      setError("Image upload failed. Use jpeg, png, webp, or gif under 5MB.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadMultipleImages(
    files: File[],
    folder: string,
    onUploaded: (urls: string[]) => void
  ) {
    if (!token) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const uploaded = await uploadAdminImages(files, token, folder);
      onUploaded(uploaded.map((image) => image.secureUrl || image.url));
      setSuccess("Images uploaded.");
    } catch {
      setError("Image upload failed. Use jpeg, png, webp, or gif under 5MB.");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    clearAuth();
    setAuth(null);
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f9ff] px-4 py-10 text-[#0c3144]">
        <div className="mx-auto max-w-[1200px] rounded-[8px] bg-white p-6 font-bold text-[#496779]">
          Loading admin dashboard...
        </div>
      </main>
    );
  }

  if (!auth) {
    return (
      <main className="min-h-screen bg-[#f0f9ff] px-4 py-10 text-[#0c3144]">
        <div className="mx-auto max-w-xl rounded-[8px] border border-[#fed7aa] bg-[#fff7ed] p-6">
          <h1 className="text-3xl font-black text-[#9a3412]">Admin login required</h1>
          <p className="mt-3 font-semibold leading-7 text-[#9a3412]">
            Log in with an admin account to access the dashboard.
          </p>
          <Link
            className="mt-5 inline-flex h-11 items-center rounded-[8px] bg-[#f97316] px-5 text-sm font-black text-white"
            href="/login?next=/admin"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (auth.user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-[#f0f9ff] px-4 py-10 text-[#0c3144]">
        <div className="mx-auto max-w-xl rounded-[8px] border border-[#fecaca] bg-[#fef2f2] p-6">
          <h1 className="text-3xl font-black text-[#991b1b]">Access denied</h1>
          <p className="mt-3 font-semibold leading-7 text-[#991b1b]">
            Your account does not have admin permissions.
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              className="inline-flex h-11 items-center rounded-[8px] bg-[#f97316] px-5 text-sm font-black text-white"
              href="/"
            >
              Back to site
            </Link>
            <Button onClick={logout} tone="secondary" type="button">
              Logout
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f9ff] text-[#0c3144]">
      <header className="border-b border-[#dff3fa] bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link className="text-sm font-black text-[#0e7490]" href="/">
              Northline
            </Link>
            <h1 className="mt-2 text-4xl font-black text-[#062f42]">
              Admin dashboard
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#496779]">
              Signed in as {auth.user.name} ({auth.user.email})
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void loadAdminData(token)} tone="secondary" type="button">
              Refresh
            </Button>
            <Button onClick={logout} tone="danger" type="button">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-5 px-4 py-6 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-[8px] border border-[#dff3fa] bg-white p-3 shadow-[0_18px_45px_rgba(12,74,110,0.08)] lg:sticky lg:top-5 lg:h-fit">
          <nav className="grid gap-2">
            {sections.map((item) => (
              <button
                className={`rounded-[8px] px-3 py-2 text-left text-sm font-black transition-colors ${
                  section === item.id
                    ? "bg-[#0ea5e9] text-white"
                    : "text-[#496779] hover:bg-[#f0f9ff] hover:text-[#0c4a6e]"
                }`}
                key={item.id}
                onClick={() => setSection(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="space-y-5">
          {error ? (
            <div className="rounded-[8px] bg-[#fff7ed] p-4 text-sm font-bold text-[#9a3412]">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-[8px] bg-[#f0fdf4] p-4 text-sm font-bold text-[#166534]">
              {success}
            </div>
          ) : null}

          {section === "overview" ? (
            <Overview summary={summary} revenue={revenue} topTours={topTours} />
          ) : null}

          {section === "users" ? (
            <UsersSection
              onDelete={(id) =>
                runAction(() => deleteAdminUser(id, token), "User deleted.")
              }
              onUploadAvatar={(file, onUploaded) =>
                void uploadSingleImage(file, "users", onUploaded)
              }
              onUpdate={(id, payload) =>
                runAction(() => updateAdminUser(id, payload, token), "User updated.")
              }
              users={users}
            />
          ) : null}

          {section === "destinations" ? (
            <Panel title="Destinations" description="Create, edit, or delete destination records.">
              <form
                className="grid gap-4 lg:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const payload = cleanObject(destinationForm);
                  void runAction(
                    () =>
                      editingDestinationId
                        ? updateDestination(editingDestinationId, payload, token)
                        : createDestination(payload, token),
                    editingDestinationId ? "Destination updated." : "Destination created."
                  );
                  setEditingDestinationId(null);
                  setDestinationForm(emptyDestination);
                }}
              >
                <Field label="Name">
                  <Input
                    onChange={(event) =>
                      setDestinationForm({ ...destinationForm, name: event.target.value })
                    }
                    required
                    value={destinationForm.name}
                  />
                </Field>
                <Field label="Slug">
                  <Input
                    onChange={(event) =>
                      setDestinationForm({ ...destinationForm, slug: event.target.value })
                    }
                    value={destinationForm.slug}
                  />
                </Field>
                <Field label="Image URL">
                  <Input
                    onChange={(event) =>
                      setDestinationForm({ ...destinationForm, image: event.target.value })
                    }
                    value={destinationForm.image}
                  />
                  <div className="mt-2">
                    <UploadButton
                      label={saving ? "Uploading..." : "Upload image"}
                      onUpload={(files) =>
                        void uploadSingleImage(files[0], "destinations", (url) =>
                          setDestinationForm({ ...destinationForm, image: url })
                        )
                      }
                    />
                  </div>
                </Field>
                <Field label="Status">
                  <Select
                    onChange={(event) =>
                      setDestinationForm({ ...destinationForm, status: event.target.value })
                    }
                    value={destinationForm.status}
                  >
                    {statusOptions.content.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </Select>
                </Field>
                <div className="lg:col-span-2">
                  <Field label="Description">
                    <Textarea
                      onChange={(event) =>
                        setDestinationForm({
                          ...destinationForm,
                          description: event.target.value,
                        })
                      }
                      value={destinationForm.description}
                    />
                  </Field>
                </div>
                <div className="flex gap-3 lg:col-span-2">
                  <Button disabled={saving} type="submit">
                    {editingDestinationId ? "Update destination" : "Create destination"}
                  </Button>
                  {editingDestinationId ? (
                    <Button
                      onClick={() => {
                        setEditingDestinationId(null);
                        setDestinationForm(emptyDestination);
                      }}
                      tone="secondary"
                      type="button"
                    >
                      Cancel edit
                    </Button>
                  ) : null}
                </div>
              </form>
              <DestinationTable
                destinations={destinations}
                onDelete={(id) =>
                  runAction(() => deleteDestination(id, token), "Destination deleted.")
                }
                onEdit={(item) => {
                  setEditingDestinationId(item.id);
                  setDestinationForm({
                    name: item.name,
                    slug: item.slug,
                    description: item.description || "",
                    image: item.image || "",
                    status: item.status,
                  });
                }}
              />
            </Panel>
          ) : null}

          {section === "categories" ? (
            <Panel title="Categories" description="Create, edit, or delete tour categories.">
              <form
                className="grid gap-4 lg:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const payload = cleanObject(categoryForm);
                  void runAction(
                    () =>
                      editingCategoryId
                        ? updateCategory(editingCategoryId, payload, token)
                        : createCategory(payload, token),
                    editingCategoryId ? "Category updated." : "Category created."
                  );
                  setEditingCategoryId(null);
                  setCategoryForm(emptyCategory);
                }}
              >
                <Field label="Name">
                  <Input
                    onChange={(event) =>
                      setCategoryForm({ ...categoryForm, name: event.target.value })
                    }
                    required
                    value={categoryForm.name}
                  />
                </Field>
                <Field label="Slug">
                  <Input
                    onChange={(event) =>
                      setCategoryForm({ ...categoryForm, slug: event.target.value })
                    }
                    value={categoryForm.slug}
                  />
                </Field>
                <Field label="Status">
                  <Select
                    onChange={(event) =>
                      setCategoryForm({ ...categoryForm, status: event.target.value })
                    }
                    value={categoryForm.status}
                  >
                    {statusOptions.content.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </Select>
                </Field>
                <div className="lg:col-span-2">
                  <Field label="Description">
                    <Textarea
                      onChange={(event) =>
                        setCategoryForm({ ...categoryForm, description: event.target.value })
                      }
                      value={categoryForm.description}
                    />
                  </Field>
                </div>
                <div className="flex gap-3 lg:col-span-2">
                  <Button disabled={saving} type="submit">
                    {editingCategoryId ? "Update category" : "Create category"}
                  </Button>
                  {editingCategoryId ? (
                    <Button
                      onClick={() => {
                        setEditingCategoryId(null);
                        setCategoryForm(emptyCategory);
                      }}
                      tone="secondary"
                      type="button"
                    >
                      Cancel edit
                    </Button>
                  ) : null}
                </div>
              </form>
              <CategoryTable
                categories={categories}
                onDelete={(id) =>
                  runAction(() => deleteCategory(id, token), "Category deleted.")
                }
                onEdit={(item) => {
                  setEditingCategoryId(item.id);
                  setCategoryForm({
                    name: item.name,
                    slug: item.slug,
                    description: item.description || "",
                    status: item.status,
                  });
                }}
              />
            </Panel>
          ) : null}

          {section === "tours" ? (
            <Panel title="Tours" description="Create, edit, and delete tour products. Put one image URL per line.">
              <TourForm
                categories={categories}
                destinations={destinations}
                editingId={editingTourId}
                form={tourForm}
                imagesInput={tourImagesInput}
                onCancel={() => {
                  setEditingTourId(null);
                  setTourForm(emptyTour);
                  setTourImagesInput("");
                }}
                onImagesInput={setTourImagesInput}
                onUploadImages={(files) =>
                  void uploadMultipleImages(files, "tours", (urls) =>
                    setTourImagesInput(
                      [tourImagesInput, ...urls].filter(Boolean).join("\n")
                    )
                  )
                }
                onSubmit={() => {
                  const payload = cleanObject({
                    ...tourForm,
                    destinationId: Number(tourForm.destinationId),
                    categoryId: Number(tourForm.categoryId),
                    priceAdult: Number(tourForm.priceAdult),
                    priceChild: Number(tourForm.priceChild || 0),
                    durationDays: Number(tourForm.durationDays || 1),
                    durationNights: Number(tourForm.durationNights || 0),
                    maxPeople: Number(tourForm.maxPeople || 1),
                    images: parseImagesInput(tourImagesInput),
                  });
                  void runAction(
                    () =>
                      editingTourId
                        ? updateTour(editingTourId, payload, token)
                        : createTour(payload, token),
                    editingTourId ? "Tour updated." : "Tour created."
                  );
                  setEditingTourId(null);
                  setTourForm(emptyTour);
                  setTourImagesInput("");
                }}
                saving={saving}
                setForm={setTourForm}
              />
              <TourTable
                onDelete={(id) => runAction(() => deleteTour(id, token), "Tour deleted.")}
                onEdit={(item) => {
                  setEditingTourId(item.id);
                  setTourForm({
                    title: item.title,
                    slug: item.slug,
                    shortDescription: item.shortDescription || "",
                    description: item.description || "",
                    destinationId: item.destinationId,
                    categoryId: item.categoryId,
                    priceAdult: Number(item.priceAdult),
                    priceChild: Number(item.priceChild),
                    durationDays: item.durationDays,
                    durationNights: item.durationNights,
                    departureLocation: item.departureLocation || "",
                    transport: item.transport || "",
                    maxPeople: item.maxPeople,
                    status: item.status,
                    images: item.images,
                  });
                  setTourImagesInput(toImagesInput(item.images));
                }}
                tours={tours}
              />
            </Panel>
          ) : null}

          {section === "schedules" ? (
            <Panel title="Tour schedules" description="Create, edit, or close departure schedules.">
              <ScheduleForm
                editingId={editingScheduleId}
                form={scheduleForm}
                onCancel={() => {
                  setEditingScheduleId(null);
                  setScheduleForm(emptySchedule);
                }}
                onSubmit={() => {
                  const createPayload = cleanObject({
                    tourId: Number(scheduleForm.tourId),
                    startDate: scheduleForm.startDate,
                    endDate: scheduleForm.endDate,
                    availableSeats: Number(scheduleForm.availableSeats),
                    priceAdult: Number(scheduleForm.priceAdult),
                    priceChild: Number(scheduleForm.priceChild || 0),
                    status: scheduleForm.status,
                  });
                  const updatePayload = cleanObject({
                    startDate: scheduleForm.startDate,
                    endDate: scheduleForm.endDate,
                    availableSeats: Number(scheduleForm.availableSeats),
                    bookedSeats: Number(scheduleForm.bookedSeats || 0),
                    priceAdult: Number(scheduleForm.priceAdult),
                    priceChild: Number(scheduleForm.priceChild || 0),
                    status: scheduleForm.status,
                  });
                  void runAction(
                    () =>
                      editingScheduleId
                        ? updateTourSchedule(editingScheduleId, updatePayload, token)
                        : createTourSchedule(
                            createPayload as Required<
                              Pick<
                                TourSchedulePayload,
                                "tourId" | "startDate" | "endDate" | "availableSeats" | "priceAdult"
                              >
                            > &
                              TourSchedulePayload,
                            token
                          ),
                    editingScheduleId ? "Schedule updated." : "Schedule created."
                  );
                  setEditingScheduleId(null);
                  setScheduleForm(emptySchedule);
                }}
                saving={saving}
                setForm={setScheduleForm}
                tours={tours}
              />
              <ScheduleTable
                onDelete={(id) =>
                  runAction(() => deleteTourSchedule(id, token), "Schedule deleted.")
                }
                onEdit={(item) => {
                  setEditingScheduleId(item.id);
                  setScheduleForm({
                    tourId: item.tourId,
                    startDate: toDateInput(item.startDate),
                    endDate: toDateInput(item.endDate),
                    availableSeats: item.availableSeats,
                    bookedSeats: item.bookedSeats,
                    priceAdult: Number(item.priceAdult),
                    priceChild: Number(item.priceChild),
                    status: item.status,
                  });
                }}
                schedules={schedules}
                tourLookup={tourLookup}
              />
            </Panel>
          ) : null}

          {section === "bookings" ? (
            <BookingsSection
              bookings={bookings}
              onCancel={(id) =>
                runAction(() => cancelBooking(id, token), "Booking cancelled.")
              }
              onUpdate={(id, payload) =>
                runAction(() => updateBookingStatus(id, payload, token), "Booking updated.")
              }
            />
          ) : null}

          {section === "reviews" ? (
            <ReviewsSection
              onDelete={(id) => runAction(() => deleteReview(id, token), "Review deleted.")}
              onUpdate={(id, payload) =>
                runAction(() => updateReview(id, payload, token), "Review updated.")
              }
              reviews={reviews}
            />
          ) : null}

          {section === "posts" ? (
            <Panel title="Posts" description="Create, edit, publish, hide, or delete posts.">
              <PostForm
                editingId={editingPostId}
                form={postForm}
                onCancel={() => {
                  setEditingPostId(null);
                  setPostForm(emptyPost);
                }}
                onSubmit={() => {
                  const payload = cleanObject(postForm);
                  void runAction(
                    () =>
                      editingPostId
                        ? updatePost(editingPostId, payload, token)
                        : createPost(payload, token),
                    editingPostId ? "Post updated." : "Post created."
                  );
                  setEditingPostId(null);
                  setPostForm(emptyPost);
                }}
                saving={saving}
                setForm={setPostForm}
                onUploadThumbnail={(file) =>
                  void uploadSingleImage(file, "posts", (url) =>
                    setPostForm({ ...postForm, thumbnail: url })
                  )
                }
              />
              <PostTable
                onDelete={(id) => runAction(() => deletePost(id, token), "Post deleted.")}
                onEdit={(item) => {
                  setEditingPostId(item.id);
                  setPostForm({
                    title: item.title,
                    slug: item.slug,
                    excerpt: item.excerpt || "",
                    content: item.content,
                    thumbnail: item.thumbnail || "",
                    status: item.status,
                  });
                }}
                posts={posts}
              />
            </Panel>
          ) : null}

          {section === "contacts" ? (
            <ContactsSection
              contacts={contacts}
              onUpdate={(id, status) =>
                runAction(
                  () => updateContactRequest(id, status, token),
                  "Contact request updated."
                )
              }
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}

function Overview({
  summary,
  revenue,
  topTours,
}: {
  summary: DashboardSummary | null;
  revenue: RevenueByMonth[];
  topTours: TopTour[];
}) {
  const metrics = summary
    ? [
        ["Users", summary.totalUsers],
        ["Tours", summary.totalTours],
        ["Active tours", summary.activeTours],
        ["Schedules", summary.totalSchedules],
        ["Bookings", summary.totalBookings],
        ["Pending bookings", summary.pendingBookings],
        ["Confirmed bookings", summary.confirmedBookings],
        ["Completed bookings", summary.completedBookings],
        ["Paid revenue", formatCurrency(summary.totalRevenue)],
      ]
    : [];

  return (
    <div className="space-y-5">
      <Panel title="Overview">
        <div className="grid gap-3 md:grid-cols-3">
          {metrics.map(([label, value]) => (
            <div className="rounded-[8px] bg-[#f8fdff] p-4" key={label}>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">
                {label}
              </p>
              <p className="mt-2 text-2xl font-black text-[#062f42]">{value}</p>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Revenue by month">
          <Table headers={["Month", "Revenue", "Bookings"]}>
            {revenue.map((item) => (
              <tr key={item.month}>
                <td className="px-4 py-3">{item.month}</td>
                <td className="px-4 py-3">{formatCurrency(item.revenue)}</td>
                <td className="px-4 py-3">{item.bookingCount}</td>
              </tr>
            ))}
          </Table>
        </Panel>
        <Panel title="Top tours">
          <Table headers={["Tour", "Guests", "Bookings"]}>
            {topTours.map((item) => (
              <tr key={item.tourId}>
                <td className="px-4 py-3 text-[#062f42]">{item.title}</td>
                <td className="px-4 py-3">{item.totalGuests}</td>
                <td className="px-4 py-3">{item.bookingCount}</td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}

function UsersSection({
  users,
  onUpdate,
  onDelete,
  onUploadAvatar,
}: {
  users: User[];
  onUpdate: (id: number, payload: { name?: string; phone?: string; avatar?: string; role?: string; status?: string }) => void;
  onDelete: (id: number) => void;
  onUploadAvatar: (file: File, onUploaded: (url: string) => void) => void;
}) {
  return (
    <Panel title="Users" description="Update profile fields, role, account status, or delete a user through the admin API.">
      <Table headers={["User", "Phone", "Role", "Status", "Actions"]}>
        {users.map((user) => (
          <UserRow
            key={user.id}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onUploadAvatar={onUploadAvatar}
            user={user}
          />
        ))}
      </Table>
    </Panel>
  );
}

function UserRow({
  user,
  onUpdate,
  onDelete,
  onUploadAvatar,
}: {
  user: User;
  onUpdate: (id: number, payload: { name?: string; phone?: string; avatar?: string; role?: string; status?: string }) => void;
  onDelete: (id: number) => void;
  onUploadAvatar: (file: File, onUploaded: (url: string) => void) => void;
}) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  return (
    <tr>
      <td className="min-w-64 px-4 py-3">
        <Input onChange={(event) => setName(event.target.value)} value={name} />
        <p className="mt-2 text-xs text-[#64748b]">{user.email}</p>
        <Input
          onChange={(event) => setAvatar(event.target.value)}
          placeholder="Avatar URL"
          value={avatar}
        />
        <div className="mt-2">
          <UploadButton
            label="Upload avatar"
            onUpload={(files) => onUploadAvatar(files[0], setAvatar)}
          />
        </div>
      </td>
      <td className="px-4 py-3">
        <Input onChange={(event) => setPhone(event.target.value)} value={phone} />
      </td>
      <td className="px-4 py-3">
        <Select onChange={(event) => setRole(event.target.value)} value={role}>
          {statusOptions.userRole.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </td>
      <td className="px-4 py-3">
        <Select onChange={(event) => setStatus(event.target.value)} value={status}>
          {statusOptions.userStatus.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </td>
      <td className="space-y-2 px-4 py-3">
        <Button
          onClick={() =>
            onUpdate(user.id, cleanObject({ name, phone, avatar, role, status }))
          }
          type="button"
        >
          Save
        </Button>
        <Button
          onClick={() => {
            if (confirmDelete(user.email)) {
              onDelete(user.id);
            }
          }}
          tone="danger"
          type="button"
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}

function DestinationTable({
  destinations,
  onEdit,
  onDelete,
}: {
  destinations: Destination[];
  onEdit: (item: Destination) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="mt-6">
      <Table headers={["Name", "Slug", "Status", "Updated", "Actions"]}>
        {destinations.map((item) => (
          <tr key={item.id}>
            <td className="px-4 py-3 text-[#062f42]">{item.name}</td>
            <td className="px-4 py-3">{item.slug}</td>
            <td className="px-4 py-3">{item.status}</td>
            <td className="px-4 py-3">{formatDate(item.updatedAt)}</td>
            <td className="flex gap-2 px-4 py-3">
              <Button onClick={() => onEdit(item)} tone="secondary" type="button">
                Edit
              </Button>
              <Button
                onClick={() => {
                  if (confirmDelete(item.name)) {
                    onDelete(item.id);
                  }
                }}
                tone="danger"
                type="button"
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  onEdit: (item: Category) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="mt-6">
      <Table headers={["Name", "Slug", "Status", "Updated", "Actions"]}>
        {categories.map((item) => (
          <tr key={item.id}>
            <td className="px-4 py-3 text-[#062f42]">{item.name}</td>
            <td className="px-4 py-3">{item.slug}</td>
            <td className="px-4 py-3">{item.status}</td>
            <td className="px-4 py-3">{formatDate(item.updatedAt)}</td>
            <td className="flex gap-2 px-4 py-3">
              <Button onClick={() => onEdit(item)} tone="secondary" type="button">
                Edit
              </Button>
              <Button
                onClick={() => {
                  if (confirmDelete(item.name)) {
                    onDelete(item.id);
                  }
                }}
                tone="danger"
                type="button"
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function TourForm({
  form,
  setForm,
  destinations,
  categories,
  editingId,
  imagesInput,
  onImagesInput,
  onUploadImages,
  onSubmit,
  onCancel,
  saving,
}: {
  form: TourPayload;
  setForm: (value: TourPayload) => void;
  destinations: Destination[];
  categories: Category[];
  editingId: number | null;
  imagesInput: string;
  onImagesInput: (value: string) => void;
  onUploadImages: (files: File[]) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <form
      className="grid gap-4 lg:grid-cols-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Field label="Title">
        <Input
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          required
          value={form.title}
        />
      </Field>
      <Field label="Slug">
        <Input
          onChange={(event) => setForm({ ...form, slug: event.target.value })}
          value={form.slug}
        />
      </Field>
      <Field label="Status">
        <Select onChange={(event) => setForm({ ...form, status: event.target.value })} value={form.status}>
          {statusOptions.tour.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </Field>
      <Field label="Destination">
        <Select
          onChange={(event) => setForm({ ...form, destinationId: Number(event.target.value) })}
          required
          value={form.destinationId}
        >
          <option value={0}>Choose destination</option>
          {destinations.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Category">
        <Select
          onChange={(event) => setForm({ ...form, categoryId: Number(event.target.value) })}
          required
          value={form.categoryId}
        >
          <option value={0}>Choose category</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Adult price">
        <Input
          min={0}
          onChange={(event) => setForm({ ...form, priceAdult: Number(event.target.value) })}
          required
          type="number"
          value={form.priceAdult}
        />
      </Field>
      <Field label="Child price">
        <Input
          min={0}
          onChange={(event) => setForm({ ...form, priceChild: Number(event.target.value) })}
          type="number"
          value={form.priceChild}
        />
      </Field>
      <Field label="Duration days">
        <Input
          min={1}
          onChange={(event) => setForm({ ...form, durationDays: Number(event.target.value) })}
          type="number"
          value={form.durationDays}
        />
      </Field>
      <Field label="Duration nights">
        <Input
          min={0}
          onChange={(event) => setForm({ ...form, durationNights: Number(event.target.value) })}
          type="number"
          value={form.durationNights}
        />
      </Field>
      <Field label="Departure location">
        <Input
          onChange={(event) =>
            setForm({ ...form, departureLocation: event.target.value })
          }
          value={form.departureLocation}
        />
      </Field>
      <Field label="Transport">
        <Input
          onChange={(event) => setForm({ ...form, transport: event.target.value })}
          value={form.transport}
        />
      </Field>
      <Field label="Max people">
        <Input
          min={0}
          onChange={(event) => setForm({ ...form, maxPeople: Number(event.target.value) })}
          type="number"
          value={form.maxPeople}
        />
      </Field>
      <div className="lg:col-span-3">
        <Field label="Short description">
          <Textarea
            onChange={(event) =>
              setForm({ ...form, shortDescription: event.target.value })
            }
            value={form.shortDescription}
          />
        </Field>
      </div>
      <div className="lg:col-span-3">
        <Field label="Description">
          <Textarea
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            value={form.description}
          />
        </Field>
      </div>
      <div className="lg:col-span-3">
        <Field label="Images">
          <Textarea
            onChange={(event) => onImagesInput(event.target.value)}
            placeholder="Upload images or paste one image URL per line. The first image is the thumbnail."
            value={imagesInput}
          />
          <div className="mt-2">
            <UploadButton label="Upload images" multiple onUpload={onUploadImages} />
          </div>
        </Field>
      </div>
      <div className="flex gap-3 lg:col-span-3">
        <Button disabled={saving} type="submit">
          {editingId ? "Update tour" : "Create tour"}
        </Button>
        {editingId ? (
          <Button onClick={onCancel} tone="secondary" type="button">
            Cancel edit
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function TourTable({
  tours,
  onEdit,
  onDelete,
}: {
  tours: Tour[];
  onEdit: (tour: Tour) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="mt-6">
      <Table headers={["Tour", "Destination", "Price", "Status", "Actions"]}>
        {tours.map((tour) => (
          <tr key={tour.id}>
            <td className="px-4 py-3 text-[#062f42]">{tour.title}</td>
            <td className="px-4 py-3">{tour.destination?.name || tour.destinationId}</td>
            <td className="px-4 py-3">{formatCurrency(Number(tour.priceAdult))}</td>
            <td className="px-4 py-3">{tour.status}</td>
            <td className="flex gap-2 px-4 py-3">
              <Button onClick={() => onEdit(tour)} tone="secondary" type="button">
                Edit
              </Button>
              <Button
                onClick={() => {
                  if (confirmDelete(tour.title)) {
                    onDelete(tour.id);
                  }
                }}
                tone="danger"
                type="button"
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function ScheduleForm({
  form,
  setForm,
  tours,
  editingId,
  onSubmit,
  onCancel,
  saving,
}: {
  form: TourSchedulePayload;
  setForm: (value: TourSchedulePayload) => void;
  tours: Tour[];
  editingId: number | null;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <form
      className="grid gap-4 lg:grid-cols-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Field label="Tour">
        <Select
          disabled={Boolean(editingId)}
          onChange={(event) => setForm({ ...form, tourId: Number(event.target.value) })}
          required
          value={form.tourId}
        >
          <option value={0}>Choose tour</option>
          {tours.map((tour) => (
            <option key={tour.id} value={tour.id}>
              {tour.title}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Start date">
        <Input
          onChange={(event) => setForm({ ...form, startDate: event.target.value })}
          required
          type="date"
          value={form.startDate}
        />
      </Field>
      <Field label="End date">
        <Input
          onChange={(event) => setForm({ ...form, endDate: event.target.value })}
          required
          type="date"
          value={form.endDate}
        />
      </Field>
      <Field label="Available seats">
        <Input
          min={1}
          onChange={(event) =>
            setForm({ ...form, availableSeats: Number(event.target.value) })
          }
          required
          type="number"
          value={form.availableSeats}
        />
      </Field>
      <Field label="Booked seats">
        <Input
          min={0}
          onChange={(event) =>
            setForm({ ...form, bookedSeats: Number(event.target.value) })
          }
          type="number"
          value={form.bookedSeats}
        />
      </Field>
      <Field label="Status">
        <Select onChange={(event) => setForm({ ...form, status: event.target.value })} value={form.status}>
          {statusOptions.schedule.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </Field>
      <Field label="Adult price">
        <Input
          min={0}
          onChange={(event) => setForm({ ...form, priceAdult: Number(event.target.value) })}
          required
          type="number"
          value={form.priceAdult}
        />
      </Field>
      <Field label="Child price">
        <Input
          min={0}
          onChange={(event) => setForm({ ...form, priceChild: Number(event.target.value) })}
          type="number"
          value={form.priceChild}
        />
      </Field>
      <div className="flex items-end gap-3">
        <Button disabled={saving} type="submit">
          {editingId ? "Update schedule" : "Create schedule"}
        </Button>
        {editingId ? (
          <Button onClick={onCancel} tone="secondary" type="button">
            Cancel edit
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function ScheduleTable({
  schedules,
  tourLookup,
  onEdit,
  onDelete,
}: {
  schedules: TourSchedule[];
  tourLookup: Map<number, string>;
  onEdit: (schedule: TourSchedule) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="mt-6">
      <Table headers={["Tour", "Dates", "Seats", "Prices", "Status", "Actions"]}>
        {schedules.map((schedule) => (
          <tr key={schedule.id}>
            <td className="px-4 py-3 text-[#062f42]">
              {schedule.tour?.title || tourLookup.get(schedule.tourId) || schedule.tourId}
            </td>
            <td className="px-4 py-3">
              {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
            </td>
            <td className="px-4 py-3">
              {schedule.bookedSeats}/{schedule.availableSeats}
            </td>
            <td className="px-4 py-3">
              {formatCurrency(Number(schedule.priceAdult))} /{" "}
              {formatCurrency(Number(schedule.priceChild))}
            </td>
            <td className="px-4 py-3">{schedule.status}</td>
            <td className="flex gap-2 px-4 py-3">
              <Button onClick={() => onEdit(schedule)} tone="secondary" type="button">
                Edit
              </Button>
              <Button
                onClick={() => {
                  if (confirmDelete(String(schedule.id))) {
                    onDelete(schedule.id);
                  }
                }}
                tone="danger"
                type="button"
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function BookingsSection({
  bookings,
  onUpdate,
  onCancel,
}: {
  bookings: Booking[];
  onUpdate: (id: number, payload: { status?: string; paymentStatus?: string }) => void;
  onCancel: (id: number) => void;
}) {
  return (
    <Panel title="Bookings" description="View all bookings, update processing and payment status, or cancel bookings.">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#e3f2f7] text-xs font-black uppercase tracking-wider text-[#64748b]">
              <th className="px-3 py-3">Mã đơn</th>
              <th className="px-3 py-3">Khách hàng</th>
              <th className="px-3 py-3">Tour</th>
              <th className="px-3 py-3 text-right">Tổng tiền</th>
              <th className="px-3 py-3 text-center">Trạng thái</th>
              <th className="px-3 py-3 text-center">Thanh toán</th>
              <th className="px-3 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f9ff]">
            {bookings.map((booking) => (
              <BookingRow
                booking={booking}
                key={booking.id}
                onCancel={onCancel}
                onUpdate={onUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function StatusBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
    UNPAID: "bg-slate-50 text-slate-600 border-slate-200",
    PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
    FAILED: "bg-red-50 text-red-600 border-red-200",
    REFUNDED: "bg-violet-50 text-violet-700 border-violet-200",
  };

  return (
    <span className={`inline-block whitespace-nowrap rounded border px-2 py-0.5 text-[11px] font-bold ${colors[value] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
      {value}
    </span>
  );
}

function BookingRow({
  booking,
  onUpdate,
  onCancel,
}: {
  booking: Booking;
  onUpdate: (id: number, payload: { status?: string; paymentStatus?: string }) => void;
  onCancel: (id: number) => void;
}) {
  const isCancelled = booking.status === "CANCELLED";
  const isCompleted = booking.status === "COMPLETED";
  const isPending = booking.status === "PENDING";
  const isConfirmed = booking.status === "CONFIRMED";

  return (
    <tr className={isCancelled ? "opacity-40" : "hover:bg-[#f8fdff]"}>
      <td className="px-3 py-3">
        <span className="font-mono text-xs font-bold text-[#062f42]">{booking.bookingCode.slice(-8)}</span>
      </td>
      <td className="px-3 py-3">
        <p className="text-sm font-semibold text-[#062f42]">{booking.user?.name || booking.contactName}</p>
        <p className="text-[11px] text-[#94a3b8]">{booking.contactPhone}</p>
      </td>
      <td className="max-w-[180px] truncate px-3 py-3 text-sm text-[#496779]">
        {booking.tourSchedule?.tour?.title || "—"}
        <p className="text-[11px] text-[#94a3b8]">{booking.adultCount} người lớn{booking.childCount > 0 ? `, ${booking.childCount} trẻ em` : ""}</p>
      </td>
      <td className="px-3 py-3 text-right text-sm font-bold text-[#f97316]">
        {formatCurrency(Number(booking.totalAmount))}
      </td>
      <td className="px-3 py-3 text-center">
        <StatusBadge value={booking.status} />
      </td>
      <td className="px-3 py-3 text-center">
        <StatusBadge value={booking.paymentStatus} />
      </td>
      <td className="px-3 py-3">
        {(isCancelled || isCompleted) ? (
          <span className="text-xs text-[#94a3b8]">—</span>
        ) : (
          <div className="flex items-center gap-1">
            {isPending && (
              <button
                className="rounded bg-blue-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-600"
                onClick={() => onUpdate(booking.id, { status: "CONFIRMED" })}
                title="Xác nhận đơn"
                type="button"
              >
                Xác nhận
              </button>
            )}
            {isConfirmed && (
              <button
                className="rounded bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-600"
                onClick={() => onUpdate(booking.id, { status: "COMPLETED" })}
                title="Hoàn thành"
                type="button"
              >
                Hoàn thành
              </button>
            )}
            {booking.paymentStatus === "UNPAID" && (
              <button
                className="rounded border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
                onClick={() => onUpdate(booking.id, { paymentStatus: "PAID" })}
                title="Xác nhận đã thanh toán"
                type="button"
              >
                Đã TT
              </button>
            )}
            <button
              className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-100"
              onClick={() => onCancel(booking.id)}
              title="Hủy đơn"
              type="button"
            >
              Hủy
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

function ReviewsSection({
  reviews,
  onUpdate,
  onDelete,
}: {
  reviews: Review[];
  onUpdate: (id: number, payload: { rating?: number; comment?: string; status?: string }) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Panel title="Reviews" description="Moderate customer reviews.">
      <Table headers={["User", "Tour", "Rating", "Comment", "Status", "Actions"]}>
        {reviews.map((review) => (
          <ReviewRow
            key={review.id}
            onDelete={onDelete}
            onUpdate={onUpdate}
            review={review}
          />
        ))}
      </Table>
    </Panel>
  );
}

function ReviewRow({
  review,
  onUpdate,
  onDelete,
}: {
  review: Review;
  onUpdate: (id: number, payload: { rating?: number; comment?: string; status?: string }) => void;
  onDelete: (id: number) => void;
}) {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment || "");
  const [status, setStatus] = useState(review.status);

  return (
    <tr>
      <td className="px-4 py-3">{review.user?.name || review.userId}</td>
      <td className="px-4 py-3 text-[#062f42]">{review.tour?.title || review.tourId}</td>
      <td className="px-4 py-3">
        <Input
          max={5}
          min={1}
          onChange={(event) => setRating(Number(event.target.value))}
          type="number"
          value={rating}
        />
      </td>
      <td className="min-w-64 px-4 py-3">
        <Textarea onChange={(event) => setComment(event.target.value)} value={comment} />
      </td>
      <td className="px-4 py-3">
        <Select onChange={(event) => setStatus(event.target.value)} value={status}>
          {statusOptions.review.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </td>
      <td className="space-y-2 px-4 py-3">
        <Button onClick={() => onUpdate(review.id, { rating, comment, status })} type="button">
          Save
        </Button>
        <Button
          onClick={() => {
            if (confirmDelete(`review #${review.id}`)) {
              onDelete(review.id);
            }
          }}
          tone="danger"
          type="button"
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}

function PostForm({
  form,
  setForm,
  editingId,
  onSubmit,
  onCancel,
  onUploadThumbnail,
  saving,
}: {
  form: PostPayload;
  setForm: (value: PostPayload) => void;
  editingId: number | null;
  onSubmit: () => void;
  onCancel: () => void;
  onUploadThumbnail: (file: File) => void;
  saving: boolean;
}) {
  return (
    <form
      className="grid gap-4 lg:grid-cols-2"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Field label="Title">
        <Input
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          required
          value={form.title}
        />
      </Field>
      <Field label="Slug">
        <Input
          onChange={(event) => setForm({ ...form, slug: event.target.value })}
          value={form.slug}
        />
      </Field>
      <Field label="Thumbnail URL">
        <Input
          onChange={(event) => setForm({ ...form, thumbnail: event.target.value })}
          value={form.thumbnail}
        />
        <div className="mt-2">
          <UploadButton
            label="Upload thumbnail"
            onUpload={(files) => onUploadThumbnail(files[0])}
          />
        </div>
      </Field>
      <Field label="Status">
        <Select onChange={(event) => setForm({ ...form, status: event.target.value })} value={form.status}>
          {statusOptions.post.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </Field>
      <div className="lg:col-span-2">
        <Field label="Excerpt">
          <Textarea
            onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
            value={form.excerpt}
          />
        </Field>
      </div>
      <div className="lg:col-span-2">
        <Field label="Content">
          <RichTextEditor
            onChange={(content) => setForm({ ...form, content })}
            value={form.content}
          />
        </Field>
      </div>
      <div className="flex gap-3 lg:col-span-2">
        <Button disabled={saving} type="submit">
          {editingId ? "Update post" : "Create post"}
        </Button>
        {editingId ? (
          <Button onClick={onCancel} tone="secondary" type="button">
            Cancel edit
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function PostTable({
  posts,
  onEdit,
  onDelete,
}: {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="mt-6">
      <Table headers={["Title", "Slug", "Status", "Updated", "Actions"]}>
        {posts.map((post) => (
          <tr key={post.id}>
            <td className="px-4 py-3 text-[#062f42]">{post.title}</td>
            <td className="px-4 py-3">{post.slug}</td>
            <td className="px-4 py-3">{post.status}</td>
            <td className="px-4 py-3">{formatDate(post.updatedAt)}</td>
            <td className="flex gap-2 px-4 py-3">
              <Button onClick={() => onEdit(post)} tone="secondary" type="button">
                Edit
              </Button>
              <Button
                onClick={() => {
                  if (confirmDelete(post.title)) {
                    onDelete(post.id);
                  }
                }}
                tone="danger"
                type="button"
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function ContactsSection({
  contacts,
  onUpdate,
}: {
  contacts: ContactRequest[];
  onUpdate: (id: number, status: string) => void;
}) {
  return (
    <Panel title="Contact requests" description="Review customer requests and update processing status.">
      <Table headers={["Customer", "Subject", "Message", "Status", "Actions"]}>
        {contacts.map((contact) => (
          <ContactRow contact={contact} key={contact.id} onUpdate={onUpdate} />
        ))}
      </Table>
    </Panel>
  );
}

function ContactRow({
  contact,
  onUpdate,
}: {
  contact: ContactRequest;
  onUpdate: (id: number, status: string) => void;
}) {
  const [status, setStatus] = useState(contact.status);

  return (
    <tr>
      <td className="px-4 py-3">
        <p className="text-[#062f42]">{contact.name}</p>
        <p className="text-xs text-[#64748b]">{contact.email}</p>
        {contact.phone ? <p className="text-xs text-[#64748b]">{contact.phone}</p> : null}
      </td>
      <td className="px-4 py-3 text-[#062f42]">{contact.subject}</td>
      <td className="min-w-72 px-4 py-3">{contact.message}</td>
      <td className="px-4 py-3">
        <Select onChange={(event) => setStatus(event.target.value)} value={status}>
          {statusOptions.contact.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </td>
      <td className="px-4 py-3">
        <Button onClick={() => onUpdate(contact.id, status)} type="button">
          Save
        </Button>
      </td>
    </tr>
  );
}
