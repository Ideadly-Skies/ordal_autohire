"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface CompanyData {
  companyName: string;
  industry: string;
  employeeCount: string;
  location: string;
  website: string;
  email: string;
  about: string;
}

interface CompanyContextType {
  companyData: CompanyData;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  updateCompanyData: (data: Partial<CompanyData>) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyName: "Tech Solutions Inc",
    industry: "Information Technology",
    employeeCount: "50-200 employees",
    location: "San Francisco, CA",
    website: "https://techsolutions.com",
    email: "contact@techsolutions.com",
    about:
      "Leading technology solutions provider with over 10 years of experience in delivering innovative software solutions to enterprises worldwide.",
  });
  const [originalData, setOriginalData] = useState<CompanyData>(companyData);

  const updateCompanyData = (data: Partial<CompanyData>) => {
    setCompanyData((prev) => ({ ...prev, ...data }));
  };

  const handleSave = () => {
    setOriginalData(companyData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCompanyData(originalData);
    setIsEditing(false);
  };

  return (
    <CompanyContext.Provider
      value={{
        companyData,
        isEditing,
        setIsEditing,
        updateCompanyData,
        handleSave,
        handleCancel,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
