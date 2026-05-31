import { useState } from "react";
import axios from "axios";

function RoomImageUpload({ roomId, refreshRooms }) {
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("access");

  const handleUpload = (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select image");
      return;
    }

    const formData = new FormData();
    formData.append("room", roomId);
    formData.append("image", image);

    axios
      .post(
        "http://127.0.0.1:8000/api/auth/vendor/room/upload-image/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(() => {
        alert("Room Image Uploaded ✅");
        setImage(null);

        // 🔥 Refresh UI
        refreshRooms();
      })
      .catch((err) => {
        console.log(err);
        alert("Upload failed ❌");
      });
  };

  return (
    <form onSubmit={handleUpload} style={{ margin: "10px 0" }}>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button className="btn">Upload</button>
    </form>
  );
}

export default RoomImageUpload;