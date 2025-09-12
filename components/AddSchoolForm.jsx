"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { put } from "@vercel/blob";

export default function AddSchoolForm({ edit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const token = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Watch for image file changes
  const watchedImage = watch("image");

  useEffect(() => {
    if (edit) {
      reset({
        name: edit.name || "",
        address: edit.address || "",
        city: edit.city || "",
        state: edit.state || "",
        contact: edit.contact || "",
        email: edit.email || "",
        image: edit.image || "",
      });

      // Set existing image preview if editing
      if (edit.image) {
        setImagePreview(edit.image);
      }
    }
  }, [edit, reset]);

  // Handle image preview when file is selected
  useEffect(() => {
    if (watchedImage && typeof watchedImage != "string" && watchedImage[0]) {
      const file = watchedImage[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  }, [watchedImage]);

  const removeImage = () => {
    setImagePreview("");
    // Reset the file input
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      let imageName = "";

      if (data.image && data.image[0] && typeof data.image !== "string") {
        // Upload file to Vercel Blob
        const file = data.image[0];
        const { url } = await put(file.name, file, {
          access: "public",
          token: token,
        });

        imageName = url; // This is the permanent public URL
      } else if (edit && edit.image && imagePreview === edit.image) {
        // Keep existing image if no new image is selected and we're editing
        imageName = edit.image;
      }

      const schoolData = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        contact: data.contact,
        email: data.email,
        image: imageName,
      };

      const response = await fetch("/api/schools", {
        method: edit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          edit ? { ...schoolData, id: edit.id } : schoolData
        ),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(`School ${edit ? "updated" : "added"} successfully!`);
        if (!edit) {
          reset();
          setImagePreview("");
        }
        setTimeout(() => {
          window.location.href = "/show-schools";
        }, 50);
      } else {
        setSubmitMessage(
          `Error ${edit ? "updating" : "adding"} school. Please try again.`
        );
      }
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitMessage(
        `Error ${edit ? "updating" : "adding"} school. Please try again.`
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {edit ? "Edit School" : "Add New School"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            School Name *
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "School name is required" })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address *
          </label>
          <textarea
            id="address"
            rows={3}
            {...register("address", { required: "Address is required" })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City *
            </label>
            <input
              type="text"
              id="city"
              {...register("city", { required: "City is required" })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State *
            </label>
            <input
              type="text"
              id="state"
              {...register("state", { required: "State is required" })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">
                {errors.state.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Number *
            </label>
            <input
              type="tel"
              id="contact"
              {...register("contact", {
                required: "Contact number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.contact ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.contact && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contact.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            School Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            {...register("image")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="School preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {edit && imagePreview === edit.image
                  ? "Current image"
                  : "Selected image"}
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? `${edit ? "Updating" : "Adding"} School...`
            : `${edit ? "Update" : "Add"} School`}
        </button>

        {submitMessage && (
          <div
            className={`p-3 rounded-md ${
              submitMessage.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
}
