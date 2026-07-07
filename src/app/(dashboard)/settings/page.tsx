"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Smartphone, Server, Check, RefreshCw, Copy } from "lucide-react";
import { useOrgProfile, useUpdateOrgProfile } from "@/hooks/useOrg";
import { OrgProfile } from "@/services/orgService";
import { useQueryClient } from "@tanstack/react-query";
import PreLoader from "@/components/modal/Preloader";

export default function SettingsPage() {
  // Navigation State
  const { data, isLoading } = useOrgProfile();
  const orgProfileUpdate = useUpdateOrgProfile();
  const queryClient = useQueryClient();

  const [profileData, setProfileData] = useState({
    companyName: "-",
    billingEmail: "-",
    phone: "-",
  });

  const [copied, setCopied] = useState(false);
  const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL}/webhooks/nomba/${data?.data.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!data) return;

    setProfileData({
      companyName: data?.data.name ?? "-",
      billingEmail: data?.data.email ?? "-",
      phone: data?.data.phone ?? "-",
    });
  }, [data]);

  // Per-field saving micro-states
  const [savingField, setSavingField] = useState<string | null>(null);
  const [savedField, setSavedField] = useState<string | null>(null);

  // Simulated background API persistence trigger onBlur
  const triggerInlineSave = (fieldName: keyof OrgProfile, value: string) => {
    setSavingField(fieldName);
    setSavedField(null);

    orgProfileUpdate.mutate(
      {
        [fieldName]: value,
      },
      {
        onSuccess: () => {
          setSavingField(null);
          setSavedField(fieldName);
          queryClient.invalidateQueries({
            queryKey: ["org-profile"],
          });
        },
        onError: () => {
          setSavingField(null);
        },
      },
    );
  };

  if (isLoading) return <PreLoader />;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header Segment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pl-border-dark pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-pl-ink tracking-tight">Workspace Configuration</h1>
          <p className="text-xs text-pl-ink-3 mt-0.5">Manage administrative properties. Changes synchronize instantly on field exit.</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] bg-pl-surface border border-pl-border-dark text-pl-ink-2 font-mono px-2 py-1 rounded w-max">
          <Server size={11} className="text-pl-emerald" /> Auto-Save Active
        </div>
      </div>

      <div className="flex gap-6 border-b border-pl-border-dark mb-6">
        {["profile", "banking"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? "text-pl-primary border-b-2 border-pl-primary" : "text-pl-ink-3 hover:text-pl-ink"}`}>
            {tab} Settings
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="bg-white border border-pl-border-dark rounded-pl-lg shadow-xs overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-pl-border-dark bg-pl-surface/30 flex items-center justify-between">
            <span className="text-xs font-bold text-pl-ink-2 uppercase tracking-wider flex items-center gap-1.5">Identity Context Parameters</span>
            {savingField && (
              <span className="text-[11px] font-medium text-pl-ink-3 flex items-center gap-1">
                <RefreshCw size={11} className="animate-spin text-pl-primary" /> Updating...
              </span>
            )}
          </div>

          <div className="p-6 space-y-5 text-left">
            <div className="relative">
              <Input
                label="Full Commercial Corporate Trading Name"
                type="text"
                value={profileData.companyName}
                onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                onBlur={() => triggerInlineSave("name", profileData.companyName)}
                placeholder="e.g., Musa Enterprises"
              />
              {savedField === "companyName" && (
                <span className="absolute right-3 top-9 text-pl-emerald text-xs font-bold flex items-center gap-0.5">
                  <Check size={12} /> Saved
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input label="Primary Billing Notification Email" type="email" value={profileData.billingEmail} placeholder="e.g., finance@company.com" disabled />
                {savedField === "billingEmail" && (
                  <span className="absolute right-3 top-9 text-pl-emerald text-xs font-bold flex items-center gap-0.5">
                    <Check size={12} /> Saved
                  </span>
                )}
              </div>

              <div className="relative">
                <Input
                  label="Contact Wireless Phone String"
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  onBlur={() => triggerInlineSave("phone", profileData.phone)}
                  placeholder="e.g., +234 803 000 0000"
                />
                {savedField === "phone" && (
                  <span className="absolute right-3 top-9 text-pl-emerald text-xs font-bold flex items-center gap-0.5">
                    <Check size={12} /> Saved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "banking" && (
        <div className="bg-white border border-pl-border-dark rounded-pl-lg shadow-xs animate-fade-in">
          <div className="p-5 border-b border-pl-border-dark bg-pl-surface/30">
            <span className="text-xs font-bold text-pl-ink-2 uppercase tracking-wider">Settlement Identifier Configuration</span>
          </div>

          <div className="p-6 space-y-6">
            {/* Editable Identifier Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Primary Identifier"
                  type="text"
                  // value={profileData.primary_id}
                  // onChange={(e) => setProfileData({ ...profileData, primary_id: e.target.value })}
                  // onBlur={() => triggerInlineSave("primary_id", profileData.primary_id)}
                  placeholder="e.g., TAX-ID-001"
                />
                {savedField === "primary_id" && <span className="absolute right-3 top-9 text-pl-emerald text-[10px] font-bold">Saved</span>}
              </div>

              <div className="relative">
                <Input
                  label="Sub-Identifier (Routing)"
                  type="text"
                  // value={profileData.sub_id}
                  // onChange={(e) => setProfileData({ ...profileData, sub_id: e.target.value })}
                  // onBlur={() => triggerInlineSave("sub_id", profileData.sub_id)}
                  placeholder="e.g., SUB-09"
                />
                {savedField === "sub_id" && <span className="absolute right-3 top-9 text-pl-emerald text-[10px] font-bold">Saved</span>}
              </div>

              <div className="pt-4 border-t border-pl-border-dark mt-2">
                <div className="relative">
                  <label className="block text-xs font-semibold text-pl-ink-2 mb-1.5">Webhook Endpoint</label>
                  <div className="flex items-center gap-2">
                    <input type="text" readOnly value={webhookUrl} className="w-full text-xs font-mono bg-pl-surface border border-pl-border-dark rounded-pl-sm px-3 py-2 text-pl-ink-2" />
                    <button onClick={handleCopy} className="p-2 border border-pl-border-dark rounded-pl-sm hover:bg-pl-surface transition-colors" title="Copy to clipboard">
                      {copied ? <Check size={14} className="text-pl-emerald" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-pl-ink-3 mt-1">Point your payment provider here for automated reconciliation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Alerts Preview Area */}
      <div className="bg-white border border-pl-border-dark rounded-pl-lg p-6 shadow-xs text-left">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone size={16} className="text-pl-emerald" />
          <h3 className="text-sm font-bold text-pl-ink">Reactive Notification Engine Blueprint</h3>
        </div>
        <p className="text-xs text-pl-ink-2 leading-relaxed mb-4">This live model displays how customer communications generate based on the current corporate context configuration:</p>
        <div className="p-4 bg-[#E2F8EE] border border-[#A7E9C9] rounded text-xs font-mono text-[#1E513C] space-y-1">
          <p className="font-bold">📱 {profileData.companyName || "Your Company"} Alert System:</p>
          <p>Hello Client, your incoming bank transfer has been matched to open invoices successfully.</p>
          <p className="text-[10px] text-emerald-700/60 pt-2">Origin Reference: {profileData.billingEmail}</p>
        </div>
      </div>
    </div>
  );
}
