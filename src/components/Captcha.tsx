"use client";
import React, { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";

const ALL_ITEMS = [
  { name: "apple", emoji: "🍎" },
  { name: "broccoli", emoji: "🥦" },
  { name: "carrot", emoji: "🥕" },
  { name: "eggplant", emoji: "🍆" },
  { name: "chocolate", emoji: "🍫" },
  { name: "mushroom", emoji: "🍄" },
];

type Item = (typeof ALL_ITEMS)[number];
type ItemName = Item["name"];

function pickList(): ItemName[] {
  const pool = [...ALL_ITEMS];
  const out: Item[] = [];
  while (out.length < 3) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out.map((x) => x.name);
}

export default function Captcha() {
  const [list, setList] = useState<ItemName[]>(() => pickList());
  const [selected, setSelected] = useState<ItemName[]>([]);
  const [drag, setDrag] = useState<ItemName | "">("");

  const isWinner = useMemo(
    () => list.every((n) => selected.includes(n)),
    [list, selected]
  );

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const payload = (e.dataTransfer.getData("text/plain") as ItemName) || drag;
    setDrag("");
    if (payload && list.includes(payload) && !selected.includes(payload)) {
      setSelected([...selected, payload]);
    } else {
      e.currentTarget.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-6px)" },
          { transform: "translateX(6px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 150 }
      );
    }
  }

  function onDragStart(
    e: React.DragEvent<HTMLButtonElement>,
    name: ItemName
  ) {
    e.dataTransfer.setData("text/plain", name);
    e.dataTransfer.effectAllowed = "copy";
    setDrag(name);
  }

  function onDragEnd() {
    setDrag("");
  }

  return (
    <div className="w-full max-w-3xl bg-sky-100 rounded-3xl p-6 shadow-xl">
      <h1 className="text-2xl font-bold mb-1">Prove you're a human.</h1>
      <p className="text-slate-700 mb-4">Complete your grocery shopping!</p>

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-4">
          {ALL_ITEMS.map((it) => (
            <button
              key={it.name}
              type="button"
              draggable
              onDragStart={(e) => onDragStart(e, it.name)}
              onDragEnd={onDragEnd}
              className={`text-5xl bg-sky-50 rounded-2xl py-4 transition hover:scale-105 ${
                drag === it.name ? "opacity-60" : ""
              }`}
              data-name={it.name}
            >
              {it.emoji}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-8">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
            onDrop={onDrop}
            className="w-40 h-40 bg-sky-100 border-[4px] border-slate-900 rounded-2xl shadow-[0_6px_0_0_#0f172a] flex items-center justify-center"
          >
            <ShoppingCart className="w-12 h-12 stroke-[3]" />
          </div>

          <div className="relative w-40 h-40">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-6 w-6 h-6 bg-pink-400 border-[4px] border-slate-900 rounded-md shadow-[0_4px_0_0_#0f172a]" />
            <div className="absolute inset-2 translate-x-2 translate-y-2 border-[4px] border-slate-900 rounded-xl bg-slate-900/10" />
            <div className="relative z-10 w-full h-full border-[4px] border-slate-900 rounded-xl bg-amber-100 shadow-[0_6px_0_0_#0f172a] flex items-center justify-center p-3">
              <ul className="space-y-1 font-semibold text-slate-900 text-center">
                {list.map((n) => (
                  <li
                    key={n}
                    className={selected.includes(n) ? "line-through text-slate-400" : ""}
                  >
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSelected([])}
            className="px-3 py-2 rounded-xl bg-slate-800 text-white"
          >
            Reset
          </button>
          <button
            onClick={() => {
              setList(pickList());
              setSelected([]);
            }}
            className="px-3 py-2 rounded-xl bg-slate-700 text-white"
          >
            New List
          </button>
        </div>
      </section>

      {isWinner && (
        <div className="mt-4 text-green-600 text-xl">✅ Great job!</div>
      )}
    </div>
  );
}
