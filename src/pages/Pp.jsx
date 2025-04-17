import React from "react";
import "../pages/styles/LegalPages.css"; // Shared CSS for styling

function PrivacyPolicy() {
  return (
    <div className="legal-container">
      <h1>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> January 1, 2024</p>

      <h2>1. Introduction</h2>
      <p>
        Your privacy is important to us. This Privacy Policy explains how <strong>eBooksHub</strong> collects, 
        uses, and protects your personal data when you use our platform.
      </p>

      <h2>2. Information We Collect</h2>
      <ul>
        <li><strong>Personal Information:</strong> Name, email, profile picture, and payment details.</li>
        <li><strong>Usage Data:</strong> Your activity on our platform, including book preferences.</li>
        <li><strong>Cookies & Tracking:</strong> We use cookies to enhance your browsing experience.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>
        We use your data to:
        <ul>
          <li>Provide personalized book recommendations.</li>
          <li>Improve our platform and user experience.</li>
          <li>Ensure compliance with applicable laws.</li>
        </ul>
      </p>

      <h2>4. Data Security</h2>
      <p>
        We implement strict security measures to protect your data. However, no online platform 
        is 100% secure. Use strong passwords and avoid sharing personal details publicly.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You have the right to access, modify, or delete your personal data. Contact us at 
        <strong>official@ebookshub.live</strong> for any concerns.
      </p>

      <h2>6. Updates to This Policy</h2>
      <p>
        We may update this Privacy Policy periodically. Any changes will be posted on this page.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
