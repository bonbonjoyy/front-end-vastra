import { useState } from "react";

const PaymentManagement = () => {
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });
  const [ewalletForm, setEwalletForm] = useState({
    provider: "",
    phoneNumber: "",
  });

  const handleBankSubmit = (e) => {
    e.preventDefault();
    alert("Detail bank berhasil disimpan!");
  };

  const handleEwalletSubmit = (e) => {
    e.preventDefault();
    alert("Detail e-wallet berhasil disimpan!");
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow">
        {/* Selector Metode Pembayaran */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              className={`px-6 py-3 rounded-lg transition-colors ${
                paymentMethod === "bank"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setPaymentMethod("bank")}
            >
              Transfer Bank
            </button>
            <button
              className={`px-6 py-3 rounded-lg transition-colors ${
                paymentMethod === "ewallet"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setPaymentMethod("ewallet")}
            >
              E-Wallet
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Form Bank Transfer */}
          {paymentMethod === "bank" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Detail Transfer Bank</h2>
              <form onSubmit={handleBankSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Bank
                  </label>
                  <select
                    value={bankForm.bankName}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, bankName: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">Pilih Bank</option>
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    value={bankForm.accountNumber}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        accountNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Masukkan nomor rekening"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    value={bankForm.accountHolder}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        accountHolder: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Masukkan nama pemilik rekening"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Simpan Detail Bank
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Form E-Wallet */}
          {paymentMethod === "ewallet" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Detail E-Wallet</h2>
              <form onSubmit={handleEwalletSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider E-Wallet
                  </label>
                  <select
                    value={ewalletForm.provider}
                    onChange={(e) =>
                      setEwalletForm({
                        ...ewalletForm,
                        provider: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">Pilih Provider</option>
                    <option value="GoPay">GoPay</option>
                    <option value="OVO">OVO</option>
                    <option value="DANA">DANA</option>
                    <option value="LinkAja">LinkAja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={ewalletForm.phoneNumber}
                    onChange={(e) =>
                      setEwalletForm({
                        ...ewalletForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Simpan Detail E-Wallet
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
