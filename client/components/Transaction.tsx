import { useRouter } from "next/router";
import CategorySelect from "./CategorySelect";
import React, { useEffect, useState } from "react";

type Transaction = {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  description: string;
  date: Date;
  amount: number;
  created_at: Date;
};

function Transaction({ id }: { id: string}) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction>({
    id: "",
    name: "",
    category_id: "",
    category_name: "",
    description: "",
    date: new Date(),
    amount: 0,
    created_at: new Date(),
  });
  const [loading, setLoading] = useState(true);

  
}