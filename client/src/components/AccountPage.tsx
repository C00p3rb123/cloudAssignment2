import axios from "axios";
import React, { useState, useEffect } from "react";

const AccountPage: React.FC = () => {
  const [accounts, setAccounts] = useState<string[]>([]);

  const fetchAccounts = async () => {
    const response = await axios.get("http://localhost:4000/storage/list");
    setAccounts(response.data);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div>
      <h1>Accounts</h1>
      <ul>
        {accounts.map((account) => (
          <div>{account}</div>
        ))}
      </ul>
    </div>
  );
};

export default AccountPage;
