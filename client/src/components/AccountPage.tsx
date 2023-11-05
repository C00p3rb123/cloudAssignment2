import axios from "axios";
import React, { useState, useEffect } from "react";
import { ShowAccountModal } from "./ShowAccountModal";
import { AddAccountModal } from "./AddAccountModal";
import { API_URL } from "../config";
import { useAuth } from "../provider/AuthProvider";

export const AccountPage: React.FC = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] =
    useState<boolean>(false);
  const { token } = useAuth();

  const fetchAccounts = async () => {
    const response = await axios.get(`${API_URL}/storage/list`);
    console.log({ response });
    const accounts = response?.data;
    if (!accounts) {
      return;
    }
    setAccounts(accounts);
  };

  useEffect(() => {
    setAccounts([]);
    fetchAccounts();
  }, [token]);

  const handleClickAccount = (account: string) => {
    setSelectedAccount(account);
    setIsAccountModalOpen(true);
  };

  const handleClickAdd = () => {
    setIsAddAccountModalOpen(true);
  };
  return (
    <>
      <ShowAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => {
          setIsAccountModalOpen(false);
        }}
        serviceName={selectedAccount}
      />
      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => {
          setIsAddAccountModalOpen(false);
          fetchAccounts();
        }}
      />
      <div className="bg-[#000e23] min-h-screen flex justify-center items-center">
        <div className="bg-gray-100 rounded-2xl flex-1 max-w-xl">
          <div className="mx-auto py-6 px-10">
            <div className="px-4 py-6">
              <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
              <ul className="mt-4">
                {accounts?.map((account) => (
                  <li
                    key={account}
                    className="bg-white shadow overflow-hidden rounded-md mb-4"
                  >
                    <div
                      className="px-4 py-5 sm:px-6 hover:bg-slate-200 hover:cursor-pointer"
                      onClick={() => handleClickAccount(account)}
                    >
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {account}
                      </h3>
                    </div>
                  </li>
                ))}
                <li className="bg-white shadow overflow-hidden rounded-md mb-4">
                  <div
                    className="px-4 py-5 sm:px-6 hover:bg-slate-200 hover:cursor-pointer"
                    onClick={() => handleClickAdd()}
                  >
                    <h3 className="text-lg leading-6 font-medium text-gray-400">
                      ➕<span className="ml-4">Add new account</span>
                    </h3>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
