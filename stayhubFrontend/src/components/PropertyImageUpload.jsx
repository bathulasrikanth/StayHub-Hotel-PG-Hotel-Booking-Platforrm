import { useState } from "react";
import axios from "axios";
import "../styling/PropertyImage.css";


function PropertyImageUpload({ propertyId, refreshProperties }) {
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("access");

  const handleUpload = (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select image");
      return;
    }

    const formData = new FormData();
    formData.append("property", propertyId);
    formData.append("image", image);

    axios
      .post(
        "http://127.0.0.1:8000/api/auth/vendor/property/upload-image/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        alert("Image Uploaded ✅");
        setImage(null);

        // 🔥 refresh properties to show image
        refreshProperties();
      })
      .catch((err) => {
        console.log(err);
        alert("Upload failed ❌");
      });
  };

  return (
    <form onSubmit={handleUpload} style={{ margin: "10px 0" }}>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit" className="btn">
        Upload
      </button>
    </form>
  );
}

export default PropertyImageUpload;