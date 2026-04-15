export const SuccessMessages = {
  USER: {
    USER_CREATED: "User created successfully",

    USER_UPDATED: "User updated successfully",

    USER_DELETED: "User deleted successfully",

    USER_GET: "Fetch user data successfully",
  },

  DESTINATION: {
    DESTINATION_CREATED: "Destination created successfully",

    DESTINATION_UPDATED: "Destination updated successfully",

    DESTINATION_DELETED: "Destination deleted successfully",

    DESTINATION_GET: "Fetch destination data successfully",
  },

  CATEGORY: {
    CATEGORY_CREATED: "Category created successfully",

    CATEGORY_UPDATED: "Category updated successfully",

    CATEGORY_DELETED: "Category deleted successfully",

    CATEGORY_GET: "Fetch category data successfully",
  },

  TOUR: {
    TOUR_CREATED: "Tour created successfully",

    TOUR_UPDATED: "Tour updated successfully",

    TOUR_DELETED: "Tour deleted successfully",

    TOUR_GET: "Fetch tour data successfully",
  },

  TOUR_SCHEDULE: {
    TOUR_SCHEDULE_CREATED: "Tour schedule created successfully",

    TOUR_SCHEDULE_UPDATED: "Tour schedule updated successfully",

    TOUR_SCHEDULE_DELETED: "Tour schedule deleted successfully",

    TOUR_SCHEDULE_GET: "Fetch tour schedule data successfully",
  },

  BOOKING: {
    BOOKING_CREATED: "Booking created successfully",

    BOOKING_UPDATED: "Booking updated successfully",

    BOOKING_CANCELLED: "Booking cancelled successfully",

    BOOKING_GET: "Fetch booking data successfully",
  },

  REVIEW: {
    REVIEW_CREATED: "Review created successfully",

    REVIEW_UPDATED: "Review updated successfully",

    REVIEW_DELETED: "Review deleted successfully",

    REVIEW_GET: "Fetch review data successfully",
  },

  FAVORITE: {
    FAVORITE_CREATED: "Favorite created successfully",

    FAVORITE_DELETED: "Favorite deleted successfully",

    FAVORITE_GET: "Fetch favorite data successfully",
  },

  POST: {
    POST_CREATED: "Post created successfully",

    POST_UPDATED: "Post updated successfully",

    POST_DELETED: "Post deleted successfully",

    POST_GET: "Fetch post data successfully",
  },

  CONTACT_REQUEST: {
    CONTACT_REQUEST_CREATED: "Contact request created successfully",

    CONTACT_REQUEST_UPDATED: "Contact request updated successfully",

    CONTACT_REQUEST_GET: "Fetch contact request data successfully",
  },

  AUTH: {
    REGISTER_SUCCESS: "Register successfully",

    LOGIN_SUCCESS: "Login successfully",

    REFRESH_TOKEN_SUCCESS: "Refresh token successfully",

    LOGOUT_SUCCESS: "Logout successfully",

    PROFILE_UPDATED: "Profile updated successfully",

    PASSWORD_CHANGED: "Password changed successfully",
  },
} as const;

export const ErrorMessages = {
  USER_NOT_FOUND: "User not found",

  DESTINATION_NOT_FOUND: "Destination not found",

  CATEGORY_NOT_FOUND: "Category not found",

  TOUR_NOT_FOUND: "Tour not found",

  TOUR_SCHEDULE_NOT_FOUND: "Tour schedule not found",

  BOOKING_NOT_FOUND: "Booking not found",

  REVIEW_NOT_FOUND: "Review not found",

  FAVORITE_NOT_FOUND: "Favorite not found",

  POST_NOT_FOUND: "Post not found",

  CONTACT_REQUEST_NOT_FOUND: "Contact request not found",

  REVIEW_EXISTS: "You already reviewed this tour",

  REVIEW_NOT_ALLOWED: "You can only review completed tours",

  FAVORITE_EXISTS: "Tour already exists in favorites",

  NOT_ENOUGH_SEATS: "Not enough seats available",

  TOUR_SCHEDULE_NOT_OPEN: "Tour schedule is not open",

  SLUG_EXISTS: "Slug already exists",

  USER_INACTIVE: "User is inactive",

  INVALID_ID: "Invalid id",

  EMAIL_EXISTS: "Email already exists",

  INVALID_CREDENTIALS: "Invalid email or password",

  UNAUTHORIZED: "You are not authorized",

  FORBIDDEN: "You do not have permission",

  VALIDATION_FAILED: "Validation failed",

  SERVER_ERROR: "Something went wrong",

  FILE_REQUIRED: "Image file is required",

  INVALID_IMAGE_FILE: "Only jpeg, png, webp and gif images are allowed",

  CLOUDINARY_NOT_CONFIGURED: "Cloudinary is not configured",
} as const;
