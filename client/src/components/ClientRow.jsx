import { FaTrash } from "react-icons/fa";
import { useMutation } from '@apollo/client'
import DELETE_CLIENT from "../mutations/clientMutations";

export default function ClientRow({ client }) {
  return (
    <tr>
      <td>{client.name}</td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      <td>
        <button className="btn btn-danger btn-small">
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}
