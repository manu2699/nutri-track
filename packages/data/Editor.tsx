
import { render, useState } from "hono/jsx/dom"

const nutrientKeys = [
  "totalFats", "saturatedFats", "unSaturatedFats", "sugar", "carbs", "proteins", "sodium",
  "potassium", "magnesium", "vitaminA", "vitaminC", "vitaminD", "fiber", "calcium", "iron"
]
const tasteOptions = ["pungent", "astringent", "spicy", "sweet", "sour", "salty", "bitter"]
const calorieMeasurements = ["1piece", "1tbsp", "1tsp", "100gm", "10gm", "10ml", "100ml"]

export function Editor(initialFoodsObj: object) {
  const [rows, setRows] = useState(Object.entries(initialFoodsObj))
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState("")
  const [modified, setModified] = useState(false)

  const filtered = rows.filter(([key, f]) =>
    key.toLowerCase().includes(search.toLowerCase()) ||
    (f.itemName||"").toLowerCase().includes(search.toLowerCase())
  )

  function updateCell(key, field, value, nutrient?) {
    setRows(prev => prev.map(([k, f]) => {
      if (k !== key) return [k, f]
      if (nutrient) {
        return [k, { ...f, nutrients: { ...f.nutrients, [nutrient]: value===''?null:parseFloat(value)||value } }]
      } else {
        return [k, { ...f, [field]: field==="calories"?parseFloat(value)||0:value }]
      }
    }))
    setModified(true)
  }

  function remove(key) {
    setRows(prev => prev.filter(([k]) => k !== key))
    setModified(true)
  }

  function add() {
    let newKey = prompt("New food key (e.g. tomato_chutney):")
    if (!newKey || rows.some(([k])=>k===newKey)) { alert("Invalid or exists"); return }
    setRows(prev => [
      ...prev,
      [
        newKey,
        {
          itemName: "",
          calories: 0,
          calorieMeasurement: "100gm",
          nutrients: Object.fromEntries(nutrientKeys.map(k=>[k,null])),
          taste: "sweet",
          region: "India/TamilNadu"
        }
      ]
    ])
    setEditing(newKey)
    setModified(true)
  }

  async function save() {
    const obj = Object.fromEntries(rows)
    const r = await fetch(window.location.pathname, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj, null, 2),
    })
    const resp = await r.json()
    alert(resp.ok ? "Saved!" : "Error saving")
    if(resp.ok) window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Nutri Track DB Editor</h1>
          <div className="flex gap-4 mb-4">
            <input type="text" className="flex-1 px-3 py-2 border rounded" placeholder="Search food..." value={search} onInput={e=>setSearch(e.target.value)} />
            <button onClick={add} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Add Row</button>
            <button disabled={!modified} onClick={save} className={`px-4 py-2 ${modified?'bg-blue-500 hover:bg-blue-700':'bg-gray-400'} text-white rounded`}>Modify &amp; Save</button>
          </div>
          <div className="text-sm text-gray-600">Total items: {filtered.length}</div>
        </div>
        <div className="overflow-auto">
          <div className="flex font-medium text-xs bg-gray-100 border-b">
            <div className="w-32 p-2 border-r">Key</div>
            <div className="w-32 p-2 border-r">Item Name</div>
            <div className="w-20 p-2 border-r">Calories</div>
            <div className="w-24 p-2 border-r">Measure</div>
            <div className="w-20 p-2 border-r">Taste</div>
            <div className="w-28 p-2 border-r">Region</div>
            {nutrientKeys.map(k=><div key={k} className="w-24 p-2 border-r capitalize">{k.replace(/([A-Z])/g," $1")}</div>)}
            <div className="w-18 p-2">Actions</div>
          </div>
          {filtered.map(([key, food]) => {
            const edit = editing===key
            return (
              <div key={key} className="flex border-b items-center hover:bg-gray-50">
                <div className="w-32 p-2 border-r">{key}</div>
                <div className="w-32 p-2 border-r">{edit
                  ? <input className="w-full border px-1" value={food.itemName||""} onInput={e=>updateCell(key,"itemName",e.target.value)} />
                  : food.itemName}</div>
                <div className="w-20 p-2 border-r">{edit
                  ? <input type="number" className="w-full border px-1" value={food.calories} onInput={e=>updateCell(key,"calories",e.target.value)} />
                  : food.calories}</div>
                <div className="w-24 p-2 border-r">{edit
                  ? <select className="w-full border" value={food.calorieMeasurement} onChange={e=>updateCell(key,"calorieMeasurement",e.target.value)}>{calorieMeasurements.map(o=><option>{o}</option>)}</select>
                  : food.calorieMeasurement}</div>
                <div className="w-20 p-2 border-r">{edit
                  ? <select className="w-full border" value={food.taste} onChange={e=>updateCell(key,"taste",e.target.value)}>{tasteOptions.map(o=><option>{o}</option>)}</select>
                  : food.taste}
                </div>
                <div className="w-28 p-2 border-r">{edit
                  ? <input className="w-full border px-1" value={food.region} onInput={e=>updateCell(key,"region",e.target.value)} />
                  : food.region}
                </div>
                {nutrientKeys.map(nk=>
                  <div className="w-24 p-2 border-r" key={nk}>
                    {edit
                    ? <input type="number" className="w-full border px-1" value={food.nutrients[nk]??""} onInput={e=>updateCell(key,"nutrients",e.target.value,nk)} />
                    : (food.nutrients[nk]!=null?food.nutrients[nk]:"null")}
                  </div>
                )}
                <div className="w-18 p-2 flex gap-1">
                  {edit
                    ? <button onClick={()=>setEditing(null)} className="px-2 py-1 bg-green-500 text-white rounded">Done</button>
                    : <button onClick={()=>setEditing(key)} className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>}
                  <button onClick={()=>remove(key)} className="px-2 py-1 bg-red-500 text-white rounded">Del</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// for direct "import" in browser modules (may be needed if dynamic imports by url)
export default Editor
