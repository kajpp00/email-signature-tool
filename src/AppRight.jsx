import { useState, useRef } from "react";





const TAMUK_EMAIL = "jon.doe@tamuk.edu";
const DEFAULT_MAILING_ADDRESS = "700 University Blvd. Kingsville Tx, 78363";
const DEFAULT_PHYSICAL_ADDRESS = "955 University Blvd, Kingsville Tx, 78363";

const initialInput = {
    name: "John Doe",
    education: "Ed.D.",
    title: "Assistant Director",
    department: "Marketing and Communications",
    msc: "111",
    building: "College Hall",
    room: "215",
    phone: "361-593-1111",
    cell: "361-455-1111",
    fax: "361-593-1111",
    email: TAMUK_EMAIL,
    mailing: DEFAULT_MAILING_ADDRESS,
    physical: DEFAULT_PHYSICAL_ADDRESS,
};

const blankInput = {
    name: "",
    education: "",
    title: "",
    department: "",
    msc: "",
    building: "",
    room: "",
    phone: "",
    cell: "",
    fax: "",
    email: "",
    mailing: "",
    physical: "",
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
    } else if (!/^[A-Z0-9._%+-]+@tamuk\.edu$/i.test(input.email.trim())) {
        errors.email = "Email must be a valid @tamuk.edu address.";
    }

    const phonePattern = /^(\(?\d{3}\)?[-.\s]?|\d{3}[-.\s]?){1}\d{3}[-.\s]?\d{4}$/;
    ["phone", "cell", "fax"].forEach(field => {
        if (input[field].trim() && !phonePattern.test(input[field].trim())) {
            errors[field] = "Enter a valid US phone number (e.g. 361-593-1111).";
        }
    });
    if (input.room && !input.building.trim()) {
        errors.building = "Building is required if Room Number is entered.";
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

    const handleChange = e => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const handleBlur = e => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    // Mailing Address Buttons
    const handleMailingDefault = () => {
        setInput(input => ({
            ...input,
            mailing: DEFAULT_MAILING_ADDRESS,
        }));
    };
    const handleMailingClear = () => {
        setInput(input => ({
            ...input,
            mailing: "",
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        setSubmitted(true);
        if (isFormValid) copyToClipboard();
    };

    const renderError = field =>
        (touched[field] || submitted) && errors[field] ? (
            <div className="invalid-feedback d-block" id={`error-${field}`}>
                {errors[field]}
            </div>
        ) : null;


    // Helper for phone links
    const phoneLink = (label, number) =>
        number
            ? `${label} <a style="color:rgb(0, 0, 238)" href="tel:${number.replace(/[^\d]/g, "")}">${number}</a>`
            : "";

    function phoneLine() {
        // P: phone | C: cell | F: fax (all clickable)
        const parts = [];
        if (input.phone) parts.push(phoneLink("P:", input.phone));
        if (input.cell) parts.push(phoneLink("C:", input.cell));
        if (input.fax) parts.push(phoneLink("F:", input.fax));
        return parts.join(" | ");
    }

    // Build the building/room line
    function buildingRoomLine() {
        const building = input.building ? input.building : "";
        const room = input.room ? `Rm ${input.room}` : "";
        const msc = input.msc ? `MSC ${input.msc}` : "";
        const parts = [];
        if (building) parts.push(building);
        if (room) parts.push(room);
        if (msc) parts.push(msc);
        return parts.length ? parts.join(" | ") : "";
    }

    function mailingAddressLine() {
        return input.mailing ? `Mailing: ${input.mailing}` : "";
    }

    const htmlSignature = `
<div style="font-family: Arial, sans-serif; color: #333;">
  <div style="margin-bottom:2px">
    <strong>${input.name}</strong>${input.education ? ", " + input.education : ""}
  </div>
  <div style="margin-bottom:2px;"><em>${input.title}</em></div>
  ${input.department ? `<div style="margin-bottom:2px;">${input.department}</div>` : ""}
  ${phoneLine() ? `<div style="margin-bottom:2px;">${phoneLine()}</div>` : ""}
  <div style="margin-bottom:2px;"><a style="color:rgb(0, 0, 238)" href="mailto:${input.email}">${input.email}</a></div>
  ${buildingRoomLine() ? `<div style="margin-bottom:2px;">${buildingRoomLine()}</div>` : ""}
  ${input.physical ? `<div style="margin-bottom:2px;">${input.physical}</div>` : ""}
  ${mailingAddressLine() ? `<div style="margin-bottom:2px;">${mailingAddressLine()}</div>` : ""}
    <img src="https://www.tamuk.edu/_images_sitewide/_marcom/BTgradient.png" alt="Texas A&M University Kingsville" style="height:90px; width:226px; margin-top:8px;" /><br/>
</div>
`;

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
        <div className="container-fluid my-5">
            <h1 className="text-center mb-5">Email Signature Creator</h1>
            <div className="row justify-content-center align-item-start">
                {/* Left: The form */}
                <div className="col-md-4 col-12 mb-4 mb-md-0">
                    <div className="card h-100 shadow">
                        <div className="card-body">
                            <form autoComplete="off" onSubmit={handleSubmit} noValidate>
                                <div className="form-group text-left">
                                    <label htmlFor="name">Name<span className="text-danger ml-1">*</span></label>
                                    <input
                                        name="name"
                                        type="text"
                                        id="name"
                                        className={`form-control${errors.name && (touched.name || submitted) ? " is-invalid" : ""}`}
                                        value={input.name}
                                        autoComplete="off"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-required="true"
                                        required
                                    />
                                    {renderError("name")}
                                </div>
                                <div className="form-group text-left">
                                    <label htmlFor="education">Education/Degree</label>
                                    <input
                                        name="education"
                                        type="text"
                                        id="education"
                                        className="form-control"
                                        value={input.education}
                                        autoComplete="off"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <div className="form-group text-left">
                                    <label htmlFor="title">Title<span className="text-danger ml-1">*</span></label>
                                    <input
                                        name="title"
                                        type="text"
                                        id="title"
                                        className={`form-control${errors.title && (touched.title || submitted) ? " is-invalid" : ""}`}
                                        value={input.title}
                                        autoComplete="off"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-required="true"
                                        required
                                    />
                                    {renderError("title")}
                                </div>
                                <div className="form-group text-left">
                                    <label htmlFor="department">Department/Division</label>
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

                                <div className="form-row">
                                    <div className="form-group col-4 text-left">
                                        <label htmlFor="phone">Phone (P:)</label>
                                        <input
                                            name="phone"
                                            type="text"
                                            id="phone"
                                            className={`form-control${errors.phone && (touched.phone || submitted) ? " is-invalid" : ""}`}
                                            value={input.phone}
                                            autoComplete="off"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            aria-label="Phone Number"
                                            aria-describedby={errors.phone ? "error-phone" : undefined}
                                            aria-invalid={!!(errors.phone && (touched.phone || submitted))}
                                        />
                                        {renderError("phone")}
                                    </div>
                                    <div className="form-group col-4 text-left">
                                        <label htmlFor="cell">Cell (C:)</label>
                                        <input
                                            name="cell"
                                            type="text"
                                            id="cell"
                                            className={`form-control${errors.cell && (touched.cell || submitted) ? " is-invalid" : ""}`}
                                            value={input.cell}
                                            autoComplete="off"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            aria-label="Cell Number"
                                            aria-describedby={errors.cell ? "error-cell" : undefined}
                                            aria-invalid={!!(errors.cell && (touched.cell || submitted))}
                                        />
                                        {renderError("cell")}
                                    </div>
                                    <div className="form-group col-4 text-left">
                                        <label htmlFor="fax">Fax (F:)</label>
                                        <input
                                            name="fax"
                                            type="text"
                                            id="fax"
                                            className={`form-control${errors.fax && (touched.fax || submitted) ? " is-invalid" : ""}`}
                                            value={input.fax}
                                            autoComplete="off"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            aria-label="Fax Number"
                                            aria-describedby={errors.fax ? "error-fax" : undefined}
                                            aria-invalid={!!(errors.fax && (touched.fax || submitted))}
                                        />
                                        {renderError("fax")}
                                    </div>
                                </div>
                                <div className="form-group text-left">
                                    <label htmlFor="email">Email<span className="text-danger ml-1">*</span></label>
                                    <input
                                        name="email"
                                        type="email"
                                        id="email"
                                        className={`form-control${errors.email && (touched.email || submitted) ? " is-invalid" : ""}`}
                                        value={input.email}
                                        autoComplete="off"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-required="true"
                                        required
                                    />
                                    {renderError("email")}
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-6 text-left">
                                        <label htmlFor="building">Building</label>
                                        <input
                                            name="building"
                                            type="text"
                                            id="building"
                                            className="form-control"
                                            value={input.building}
                                            autoComplete="off"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    <div className="form-group col-6 text-left">
                                        <label htmlFor="room">Room Number</label>
                                        <input
                                            name="room"
                                            type="text"
                                            id="room"
                                            className="form-control"
                                            value={input.room}
                                            autoComplete="off"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                </div>
                                <div className="form-group text-left">
                                    <label htmlFor="physical">Physical Address</label>
                                    <input
                                        name="physical"
                                        type="text"
                                        id="physical"
                                        className="form-control"
                                        value={input.physical}
                                        autoComplete="off"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-6 text-left">
                                        <label htmlFor="msc">MSC</label>
                                        <input
                                            name="msc"
                                            type="text"
                                            id="msc"
                                            className="form-control"
                                            value={input.msc}
                                            autoComplete="off"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    <div className="form-group col-6 text-left">
                                        <label htmlFor="mailing">Mailing Address</label>
                                        <div className="input-group">
                                            <input
                                                name="mailing"
                                                type="text"
                                                id="mailing"
                                                className="form-control"
                                                value={input.mailing}
                                                autoComplete="off"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={handleMailingDefault}
                                                    title="Set to default mailing address"
                                                >
                                                    Default
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={handleMailingClear}
                                                    title="Clear mailing address"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-fill mr-2"
                                        disabled={!isFormValid}
                                        aria-disabled={!isFormValid}
                                    >
                                        Copy to Clipboard
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary flex-fill"
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to clear all fields and the preview?")) {
                                                setInput(blankInput);
                                                setTouched({});
                                                setSubmitted(false);
                                            }
                                        }}
                                    >
                                        Clear Form
                                    </button>
                                </div>
                            </form>
                            <div className="text-muted mt-3 text-left" style={{ fontSize: 12 }}>
                                Paste your signature into the “Signature” section in Outlook.<br />
                                Tip: Use <b>Paste</b> or <b>Ctrl+V</b> after copying!
                            </div>
                        </div>
                    </div>
                </div>
                {/* Right: The Preview */}
                <div className="col-md-4 col-12">
                    <div className=" w-100 card shadow">
                        <div className="card-body">
                            <h3 className="mb-2 text-left">Preview</h3>
                            <div
                                className="border rounded p-3 mb-2 bg-white text-left"
                                style={{ background: "#fff" }}
                            >
                                <div
                                    ref={signatureRef}
                                    tabIndex={0}
                                    aria-label="Signature preview"
                                    dangerouslySetInnerHTML={{ __html: htmlSignature }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;