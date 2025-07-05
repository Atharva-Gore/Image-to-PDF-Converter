const convertBtn = document.getElementById("convertBtn");
const imageInput = document.getElementById("imageInput");
const statusText = document.getElementById("status");

convertBtn.addEventListener("click", async () => {
  const files = imageInput.files;
  if (files.length === 0) {
    statusText.textContent = "Please select at least one image.";
    statusText.style.color = "red";
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  statusText.textContent = "Generating PDF...";
  statusText.style.color = "black";

  for (let i = 0; i < files.length; i++) {
    const imgDataUrl = await readFileAsDataURL(files[i]);
    const img = new Image();
    img.src = imgDataUrl;

    await new Promise((resolve) => {
      img.onload = function () {
        const imgWidth = 210;
        const imgHeight = (img.height * imgWidth) / img.width;
        if (i > 0) pdf.addPage();
        pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
        resolve();
      };
    });
  }

  pdf.save("images.pdf");
  statusText.textContent = "PDF downloaded!";
  statusText.style.color = "green";
});

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
