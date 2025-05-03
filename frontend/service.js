const apiUrl = "https://file-uploader-xctw.onrender.com";

async function fetchUserData() {
  try {
    const response = await fetch(`${apiUrl}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const { message } = await response.json();
      console.log(message);
      return null;
    }

    const { user } = await response.json();

    return user;
  } catch {
    return null;
  }
}

export { apiUrl, fetchUserData };
