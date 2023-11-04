import axios from "axios";
import React, { useState, useEffect } from "react";
import { ShowAccountModal } from "./ShowAccountModal";
import { AddAccountModal } from "./AddAccountModal";
import { API_URL } from "../config";

export const AccountPage: React.FC = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] =
    useState<boolean>(false);
  const fetchAccounts = async () => {
    const response = await axios.get(`${API_URL}/storage/list`);
    console.log({ response });
    setAccounts(response.data);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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
        <div className="bg-gray-100 rounded-2xl flex-1 max-w-3xl">
          <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
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
