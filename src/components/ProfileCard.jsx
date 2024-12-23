export const ProfileCard = ({ title, data }) => (
  <div className="card card-icon border-custom lift lift-sm mb-2 mt-1">
    <div className="card-header bg-custom text-white">{title}</div>
    <div className="card-body py-1">
      <table className="table table-borderless mb-0">
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="border-bottom">
              <td style={{ width: "30%" }}>{key}</td>
              <td>
                <div className="font-weight-bold">{value}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
