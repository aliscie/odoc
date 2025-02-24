import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import sanitizeHtml from "sanitize-html";

const EmailComposer = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Initialize EmailJS
  emailjs.init(import.meta.env.VITE_REACT_APP_EMAILJS_USER_ID);

  const handleSendEmail = async () => {
    try {
      setIsSending(true);

      const sanitizedHtml = sanitizeHtml(htmlContent, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          a: ["href", "target"],
          img: ["src", "alt"],
        },
      });

      const response = await emailjs.send(
        import.meta.env.VITE_REACT_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          from_email: "contact@odoc.app",
          to_email: ['alihushamsci@yahoo.com',"alihushamsci@icloud.com", "weplutus.1@gmail.com"], // Hardcoded recipient
          subject: subject,
          html_message: sanitizedHtml,
        },
      );

      if (response.status === 200) {
        alert("Email sent successfully!");
        setIsDialogOpen(false);
        setHtmlContent("");
        setSubject("");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email: " + error.text);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsDialogOpen(true)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Compose Email
      </button>

      {isDialogOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            zIndex: 1000,
            width: "80%",
            maxWidth: "800px",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <h4>HTML Editor</h4>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                style={{
                  width: "100%",
                  height: "300px",
                  padding: "10px",
                  fontFamily: "monospace",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                placeholder="Enter HTML content here..."
              />
            </div>

            <div>
              <h4>Preview</h4>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  height: "300px",
                  overflow: "auto",
                }}
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(htmlContent, {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                      "img",
                    ]),
                    allowedAttributes: {
                      ...sanitizeHtml.defaults.allowedAttributes,
                      a: ["href", "target"],
                      img: ["src", "alt"],
                    },
                  }),
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button
              onClick={handleSendEmail}
              disabled={isSending}
              style={{
                padding: "10px 20px",
                backgroundColor: isSending ? "#6c757d" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSending ? "not-allowed" : "pointer",
              }}
            >
              {isSending ? "Sending..." : "Send Email"}
            </button>
            <button
              onClick={() => setIsDialogOpen(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailComposer;
