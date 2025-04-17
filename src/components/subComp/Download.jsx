import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet'; // For better SEO management
import qrCode from './assets/frame.png';
import './styles/Download.css'; // Assuming you have a CSS file for styles

const Download = () => {
  useEffect(() => {
    // Initialize download analytics tracking
    document.title = "Download Ebookshub | Free eBooks & Self-Publishing Platform";
  }, []);

  const handleDownload = () => {
    // Track download event with analytics
    if (window.gtag) {
      window.gtag('event', 'app_download', {
        'event_category': 'conversion',
        'event_label': 'android_apk'
      });
    }
    window.location.href = 'https://github.com/MrHussnainAhmad/eBooksHub-apk/releases/download/freeBooksStoreV1.05/eBooksHubV1.0.5.apk';
  };

  return (
    <div className="download-page">
      <Helmet>
        <title>Download Ebookshub | Free eBooks & Self-Publishing Platform</title>
        <meta 
          name="description" 
          content="Download Ebookshub for Android - Access 10,000+ free eBooks and self-publish your work. Get early access to our app before the official Play Store launch."
        />
        <meta 
          name="keywords" 
          content="free ebooks, ebook app download, self-publish ebooks, android reading app, epub reader, digital library, free publishing platform"
        />
        <meta property="og:title" content="Download Ebookshub Android App" />
        <meta property="og:description" content="Read & publish eBooks for free with Ebookshub" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ebookshub.com/download" />
        <meta property="og:image" content="https://ebookshub.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Ebookshub",
            "operatingSystem": "ANDROID",
            "applicationCategory": "ReadingApp",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "356"
            },
            "description": "Free eBook reading and publishing platform with 10,000+ titles",
            "downloadUrl": "https://ebookshub.com/ebookshub.apk"
          })}
        </script>
      </Helmet>

      <main className="download-container">
        <section className="hero-section" aria-labelledby="main-heading">
          <div className="download-content">
            <h1 id="main-heading" className="main-heading">Download Ebookshub for Android</h1>
            <p className="subtitle">Access 10,000+ Free eBooks & Self-Publish Your Creative Work</p>
            
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Extensive eBook Library</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔄</span>
                <span>Weekly Content Updates</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✍️</span>
                <span>Free Self-Publishing</span>
              </div>
            </div>
            
            <button 
              onClick={handleDownload}
              className="download-button"
              aria-label="Download Ebookshub Android APK"
            >
              <span className="download-icon">⬇️</span>
              Download Now (APK)
            </button>

            <div className="platform-notes">
              <p className="platform-note"><span className="note-icon">⚠️</span> Available for Android 6.0 and above</p>
              <p className="platform-note"><span className="note-icon">📱</span> iOS version launching Q3 2025</p>
              <p className="platform-note"><span className="note-icon">🎉</span> Play Store release coming soon</p>
            </div>
          </div>

          <div className="qr-container">
            <div className="qr-card">
              <img 
                src={qrCode} 
                alt="QR code to download Ebookshub Android app" 
                className="qr-image"
                width="200"
                height="200"
                loading="eager"
              />
              <p className="qr-caption">Scan to download directly</p>
            </div>
          </div>
        </section>

        <section className="why-section" aria-labelledby="why-heading">
          <h2 id="why-heading" className="section-heading">Why Readers & Authors Choose Ebookshub</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">📚</div>
              <h3>Extensive Library</h3>
              <p>Access 10,000+ free eBooks across fiction, non-fiction, academic, and specialized genres</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">✍️</div>
              <h3>Author Freedom</h3>
              <p>Self-publish with zero fees, retain full rights to your work, and reach thousands of readers</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔒</div>
              <h3>Privacy-Focused</h3>
              <p>DRM-free eBooks, secure reading environment, with strict data privacy protections</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔄</div>
              <h3>Continuous Updates</h3>
              <p>Weekly new releases and regular app improvements based on community feedback</p>
            </div>
          </div>
        </section>

        <section className="installation-section" aria-labelledby="installation-heading">
          <h2 id="installation-heading" className="section-heading">Easy Installation Guide</h2>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Download</h3>
              <p>Click the download button above or scan the QR code to download the APK file</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Enable Installation</h3>
              <p>Go to Settings → Security → Enable "Unknown Sources" or "Install Unknown Apps"</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Install</h3>
              <p>Open the APK file and follow the on-screen instructions to complete installation</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Enjoy Reading</h3>
              <p>Create an account or log in as guest to start exploring our eBook collection</p>
            </div>
          </div>
        </section>

        <section className="faq-section" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="section-heading">Frequently Asked Questions</h2>
          
          <div className="faq-accordion">
            <details className="faq-item">
              <summary className="faq-question">Is the APK safe to install?</summary>
              <div className="faq-answer">
                <p>Yes, our APK is completely safe. It's digitally signed, regularly scanned for malware, and verified by multiple security tools. We prioritize user safety and data security.</p>
              </div>
            </details>
            
            <details className="faq-item">
              <summary className="faq-question">What Android version is required?</summary>
              <div className="faq-answer">
                <p>Ebookshub requires Android 6.0 (Marshmallow) or higher. For optimal performance, we recommend Android 8.0 or newer versions.</p>
              </div>
            </details>
            
            <details className="faq-item">
              <summary className="faq-question">When will the iOS version be available?</summary>
              <div className="faq-answer">
                <p>Our iOS app is currently in development and scheduled for release in Q3 2025. Sign up for our newsletter to be notified when it launches.</p>
              </div>
            </details>
            
            <details className="faq-item">
              <summary className="faq-question">How do I publish my own eBook?</summary>
              <div className="faq-answer">
                <p>After installing the app, create an author account, navigate to the "Publish" section, and follow the guided process. You can upload manuscripts in PDF, EPUB, or DOCX formats. Our publishing tools help with formatting and cover design.</p>
              </div>
            </details>
            
            <details className="faq-item">
              <summary className="faq-question">Are all eBooks really free?</summary>
              <div className="faq-answer">
                <p>We offer over 10,000 completely free eBooks. Premium titles from publishing partners may have a small fee, but all self-published works from our community are available at no cost.</p>
              </div>
            </details>
          </div>
        </section>
        
        <section className="cta-section">
          <div className="cta-container">
            <h2 className="cta-heading">Join Our Growing Community of Readers & Authors</h2>
            <p className="cta-subtext">Experience the future of digital reading and publishing today</p>
            <button 
              onClick={handleDownload}
              className="cta-button"
              aria-label="Download Ebookshub Android APK Now"
            >
              Download Ebookshub Now
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Download;