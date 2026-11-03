import { useState, useRef } from "react";
import TamukLogo from './assets/btgradient.png';

const TAMUK_LOGO_URL = TamukLogo;
const TAMUK_EMAIL = "yourname@tamuk.edu";

const initialInput = {
  name: "",
  title: "",
  department: "",
  phone: "",
  address1: "",
  address2: "",
  email: TAMUK_EMAIL,
};

function validate(input) {
  const errors = {};

  if (!input.name.trim()) {
    errors.name = "Name is required.";
  }
  if (!input.title.trim()) {
    errors.title = "Title is required.";
  }
  if (!input.email.trim()) {
    errors.email = "Email is required.";
  } else if (
    !/^[A-Z0-9._%+-]+@tamuk\.edu$/i.test(input.email.trim())
  ) {
    // <--- This regex ensures the email ends with @tamuk.edu and is otherwise valid.
    errors.email = "Email must be a valid @tamuk.edu address.";
  }

  if (input.phone.trim()) {
    const phonePattern = /^(\(?\d{3}\)?[-.\s]?|\d{3}[-.\s]?){1}\d{3}[-.\s]?\d{4}$/;
    if (!phonePattern.test(input.phone.trim())) {
      errors.phone = "Enter a valid US phone number (e.g. 361-555-1234).";
    }
  }

  return errors;
}
function App() {
  const [input, setInput] = useState(initialInput);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const signatureRef = useRef(null);

  const errors = validate(input);
  const isFormValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (isFormValid) {
      copyToClipboard();
    }
  };

  const renderError = (field) =>
    (touched[field] || submitted) && errors[field] ? (
      <div className="invalid-feedback d-block" id={`error-${field}`}>
        {errors[field]}
      </div>
    ) : null;

  const htmlSignature = `
<div style="font-family: Arial, sans-serif; color: #333;">
  <div style="margin-bottom: 8px; text-transform: capitalize">
    <strong>${input.name}</strong>
  </div>
  <div style="margin-bottom: 4px;">${input.title}</div>
  ${
    input.department
      ? `<div style="margin-bottom: 4px;">${input.department}</div>`
      : ""
  }
  <div style="margin-bottom: 4px;">
    ${
      input.phone
        ? `Phone: <a href="tel:${input.phone}">${input.phone}</a>`
        : ""
    }
  </div>
  <div style="margin-bottom: 6px;">
    Email: <a href="mailto:${input.email}">${input.email}</a>
  </div>
  <div style="margin-bottom: 4px;">${input.address1}</div>
  <div style="margin-bottom: 4px;">${input.address2}</div>
  <img src="${TAMUK_LOGO_URL}" alt="Texas A&M University Kingsville" style="height:68px; margin-top:8px;" /><br/>
</div>
`;

  // Accessible copy logic
  const copyToClipboard = () => {
    if (signatureRef.current) {
      const range = document.createRange();
      range.selectNode(signatureRef.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      try {
        document.execCommand("copy");
        alert(
          "Signature copied to clipboard! Paste it into Outlook’s signature field."
        );
      } catch (err) {
        alert("Failed to copy. Try manually selecting and copying.");
        console.log(err.message);
      }
      sel.removeAllRanges();
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: 550 }}>
      <div className="card shadow">
        <div className="card-body">
          <h2 className="mb-4 text-left">TAMUK Email Signature Creator</h2>
          <form autoComplete="off" onSubmit={handleSubmit} noValidate>
            <div className="form-group text-left">
              <label htmlFor="name">
                Name<span className="text-danger ml-1">*</span>
              </label>
              <input
                name="name"
                type="text"
                id="name"
                className={`form-control${
                  errors.name && (touched.name || submitted) ? " is-invalid" : ""
                }`}
                value={input.name}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={!!(errors.name && (touched.name || submitted))}
                aria-describedby={errors.name ? "error-name" : undefined}
                style={{ textTransform: "capitalize" }}
                required
              />
              {renderError("name")}
            </div>
            <div className="form-group text-left">
              <label htmlFor="title">
                Title<span className="text-danger ml-1">*</span>
              </label>
              <input
                name="title"
                type="text"
                id="title"
                className={`form-control${
                  errors.title && (touched.title || submitted) ? " is-invalid" : ""
                }`}
                value={input.title}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={!!(errors.title && (touched.title || submitted))}
                aria-describedby={errors.title ? "error-title" : undefined}
                required
              />
              {renderError("title")}
            </div>
            <div className="form-group text-left">
              <label htmlFor="department">
                Department or Division
              </label>
              <input
                name="department"
                type="text"
                id="department"
                className="form-control"
                value={input.department}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="form-group text-left">
              <label htmlFor="phone">Phone</label>
              <input
                name="phone"
                type="text"
                id="phone"
                className={`form-control${
                  errors.phone && (touched.phone || submitted) ? " is-invalid" : ""
                }`}
                value={input.phone}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                aria-describedby={errors.phone ? "error-phone" : undefined}
                aria-invalid={!!(errors.phone && (touched.phone || submitted))}
              />
              {renderError("phone")}
            </div>
            <div className="form-group text-left">
              <label htmlFor="address1">Address Line 1</label>
              <input
                name="address1"
                type="text"
                id="address1"
                className="form-control"
                value={input.address1}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="form-group text-left">
              <label htmlFor="address2">Address Line 2</label>
              <input
                name="address2"
                type="text"
                id="address2"
                className="form-control"
                value={input.address2}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="form-group text-left">
              <label htmlFor="email">
                Email<span className="text-danger ml-1">*</span>
              </label>
              <input
                name="email"
                type="email"
                id="email"
                className={`form-control${
                  errors.email && (touched.email || submitted) ? " is-invalid" : ""
                }`}
                value={input.email}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required="true"
                aria-invalid={!!(errors.email && (touched.email || submitted))}
                aria-describedby={errors.email ? "error-email" : undefined}
                required
              />
              {renderError("email")}
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block mt-4"
              disabled={!isFormValid}
              aria-disabled={!isFormValid}
            >
              Copy to Clipboard
            </button>
          </form>
          <h3 className="mt-4 mb-2 text-left">Signature Preview</h3>
          <div className="border rounded p-3 mb-2 bg-white text-left" style={{ background: "#fff" }}>
            <div ref={signatureRef} tabIndex={0} aria-label="Signature preview" dangerouslySetInnerHTML={{ __html: htmlSignature }} />
          </div>
          <div className="text-muted mt-2 text-left" style={{ fontSize: 12 }}>
            Paste your signature into the “Signature” section in Outlook.<br />
            Tip: Use <b>Paste</b> or <b>Ctrl+V</b> after copying!
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;