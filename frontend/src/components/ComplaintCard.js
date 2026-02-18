function ComplaintCard({ data }) {

  return (
    <div className="complaint-card">

      {/* HEADER */}

      <div className="complaint-header">
        <span>
          #{data.id} — {data.status.toUpperCase()}
        </span>
      </div>

      {/* CALL DETAILS */}

      <div className="section">
        <h4>Call Details:</h4>

        <p>Date: {data.date || "Today"}</p>
        <p>Customer: {data.customer}</p>
        <p>Mobile: {data.mobile}</p>

        <span className="tag critical">
          {data.priority}
        </span>

        <span className="tag onsite">
          {data.serviceType}
        </span>
      </div>

      {/* CUSTOMER DETAILS */}

      <div className="section">
        <h4>Customer Details:</h4>

        <p>{data.customer}</p>
        <p>{data.address}</p>
      </div>

      {/* PRODUCT DETAILS */}

      <div className="section">
        <h4>Product Details:</h4>

        <p>{data.product}</p>
      </div>

      {/* PROBLEM DETAILS */}

      <div className="section">
        <h4>Problem Details:</h4>

        <p>{data.issue}</p>
      </div>

      {/* ACTIONS */}

      <div className="actions">

        <button className="ack">
          Acknowledge
        </button>

        <button className="quote">
          Generate Quotation
        </button>

      </div>

    </div>
  );
}

export default ComplaintCard;
