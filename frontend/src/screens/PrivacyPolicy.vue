<template>
  <div class="privacy-policy-container">
    <!-- Toggle Button for TOC -->
    <button @click="toggleToc" class="toggle-btn">☰ Table of Contents</button>

    <!-- Table of Contents -->
    <div :class="['toc', { hide: isTocHidden }]" id="toc">
      <br><br>
      <ul class="list-unstyled">
        <li><a href="#information-collection" @click="scrollToSection('information-collection')">Information We
            Collect</a></li>
        <li><a href="#use-of-information" @click="scrollToSection('use-of-information')">How We Use Your Information</a>
        </li>
        <li><a href="#sharing-disclosure" @click="scrollToSection('sharing-disclosure')">Sharing and Disclosure</a></li>
        <li><a href="#data-security" @click="scrollToSection('data-security')">Data Security</a></li>
        <li><a href="#your-rights" @click="scrollToSection('your-rights')">Your Rights</a></li>
        <li><a href="#policy-changes" @click="scrollToSection('policy-changes')">Changes to This Policy</a></li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="content container">
      <h1 class="display-2 text-center my-5">Privacy Policy</h1>

      <section id="information-collection" class="mb-5">
        <div class="spacer" id="spacer-information-collection"></div>
        <h2>1. Information We Collect</h2>
        <p>We collect various types of information to enhance your experience and provide you with the best possible
          service. This includes:</p>
        <ul>
          <li><strong>Personal Information:</strong> When you create an account, make purchases, or contact customer
            support, we may collect information such as your name, email address, and phone number.</li>
          <li><strong>Usage Data:</strong> We gather details on how you interact with our platform, including pages
            visited, links clicked, time spent on pages, and other interaction patterns. This helps us understand and
            improve user engagement.</li>
          <li><strong>Device and Location Data:</strong> Information related to your device type, operating system,
            browser type, IP address, and, if permitted, your geographic location, helps us optimize performance and
            enhance security.</li>
          <li><strong>Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to track
            activity on our platform, improve user experience, and analyze usage. You can control your cookie
            preferences through your browser settings.</li>
        </ul>
      </section>

      <section id="use-of-information" class="mb-5">
        <div class="spacer" id="spacer-information-collection"></div>
        <h2>2. How We Use Your Information</h2>
        <p>We utilize the information we collect for several key purposes, including:</p>
        <ul>
          <li><strong>Service Provision:</strong> To provide, personalize, and maintain our services, including
            processing transactions, supporting customer service, and tailoring recommendations to your preferences.
          </li>
          <li><strong>Communications:</strong> To send you updates, promotional content, and important notifications
            regarding your account, transactions, and service updates.</li>
          <li><strong>Data Analytics:</strong> To analyze trends, usage, and performance to improve and develop new
            services, enhance user experience, and monitor the effectiveness of marketing and promotional activities.
          </li>
          <li><strong>Compliance and Protection:</strong> To ensure compliance with applicable laws, enforce our terms
            and policies, and protect against fraud, abuse, and other harmful activities.</li>
        </ul>
      </section>

      <section id="sharing-disclosure" class="mb-5">
        <div class="spacer" id="spacer-information-collection"></div>
        <h2>3. Sharing and Disclosure</h2>
        <p>We respect your privacy and do not sell or share your personal information with third parties, except in the
          following circumstances:</p>
        <ul>
          <li><strong>Service Providers:</strong> We work with third-party vendors who assist in areas such as hosting,
            data storage, analytics, and customer support. These providers are required to adhere to strict data privacy
            standards and may only use your data as instructed by us.</li>
          <li><strong>Legal Compliance:</strong> We may disclose your information if required by law, regulation, or
            legal process, such as in response to a court order or a lawful request by public authorities.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, asset sale, or other business
            transaction, your information may be transferred to the new entity, with notification provided as
            applicable.</li>
          <li><strong>Protective Purposes:</strong> To protect the rights, property, or safety of our company, our
            users, or others, we may disclose your information when necessary to enforce our policies and prevent fraud
            or abuse.</li>
        </ul>
      </section>

      <section id="data-security" class="mb-5">
        <div class="spacer" id="spacer-information-collection"></div>
        <h2>4. Data Security</h2>
        <p>We take data security seriously and implement industry-standard practices to protect your personal
          information from unauthorized access, alteration, or loss. However, please note that no online data
          transmission or storage method is entirely secure. While we strive to protect your data, we cannot guarantee
          absolute security.</p>
      </section>

      <section id="your-rights" class="mb-5">
        <div class="spacer" id="spacer-information-collection"></div>
        <h2>5. Your Rights</h2>
        <p>You have certain rights regarding your personal information, including:</p>
        <ul>
          <li><strong>Access and Correction:</strong> You may request access to, correction of, or deletion of your
            personal data held by us. Contact us at <a href="mailto:example@example.com">example@example.com</a> to
            exercise these rights.</li>
          <li><strong>Data Portability:</strong> In certain cases, you may have the right to obtain a copy of your
            personal information in a structured, commonly used, and machine-readable format.</li>
          <li><strong>Opt-Out of Communications:</strong> You can opt out of receiving promotional emails by following
            the unsubscribe instructions in our emails. Please note that you may still receive important updates related
            to your account and services.</li>
        </ul>
      </section>

      <section id="policy-changes" class="mb-5">
        <div class="spacer" id="spacer-information-collection"></div>
        <h2>6. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal
          requirements. When we make significant changes, we will notify you by updating the date at the top of this
          page and, if required, providing more prominent notice (such as through email notifications).</p>
        <p>We encourage you to review this policy periodically to stay informed about our privacy practices. Your
          continued use of our services following any updates constitutes acceptance of the revised policy.</p>
      </section>

      <div class="text-center mt-5">
        <p>If you have any questions or concerns about our Privacy Policy, please contact us at <a
            href="mailto:example@example.com">example@example.com</a>.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTocHidden: false, // State to toggle Table of Contents visibility
      windowWidth: window.innerWidth, // Track window width
    };
  },
  methods: {
  toggleToc() {
    this.isTocHidden = !this.isTocHidden;
  },
  scrollToSection(sectionId) {
    const spacer = document.getElementById(`spacer-${sectionId}`);
    if (spacer) {
      spacer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  },
  updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
  },
  watch: {
    windowWidth(newWidth) {
      // Collapse TOC below 992px and reappear above 1200px
      if (newWidth < 1200) {
        this.isTocHidden = true;
      } else if (newWidth >= 1200) {
        this.isTocHidden = false;
      }
    },
  },
  mounted() {
    // Initialize TOC state based on initial screen size
    if (this.windowWidth < 1200) {
      this.isTocHidden = true;
    } else if (this.windowWidth >= 1200) {
      this.isTocHidden = false;
    }
    // Listen for resize events to update window width dynamically
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeUnmount() {
    // Clean up event listener when component is destroyed
    window.removeEventListener("resize", this.updateWindowWidth);
  },
};
</script>

<style scoped>
/* General styling */
.privacy-policy-container {
  display: flex;
  justify-content: left;
  /* Center the container horizontally */
}

.container {
  max-width: 1000px;
  padding-top: 20px;
  padding-bottom: 40px;
  text-align: left;
}

/* Styling for the TOC */
.toc {
  position: fixed;
  top: 150px;
  left: 20px;
  max-width: 300px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-align: left;
}

.toc.hide {
  transform: translateX(-300px);

}

.toc h3 {
  font-size: 2rem;
}

.toc a {
  color: #313131;
  text-decoration: none;
  font-size: 1.5rem;
  display: block; /* Makes each link take up full width */
  padding: 10px 0; /* Adds space between links */
}

.toc a:hover {
  text-decoration: underline;
}

/* Toggle button styling */
.toggle-btn {
  position: fixed;
  top: 170px;
  left: 69px;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 1001;
  border-color: #1161b2;
  color: rgb(214, 214, 214);
  background-color: #1161b2;
  padding: 5px 10px;
  border-radius: 5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    margin-left: 0;
  }

  .toc {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    transform: translateY(-100%);
  }

  .toc.show {
    transform: translateY(0);
  }
}

.spacer {
  height: 90px; /* Adjust this height to set the offset above each section */
  margin-top: -80px; /* Pull the spacer up to create the visual offset */
  visibility: hidden; /* Keep the spacer hidden */
}

h1,h2{
  font-weight: 600;
}

</style>
