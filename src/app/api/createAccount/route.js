import { createConnection } from "@/../lib/connectDB"
import { NextResponse } from "next/server";

export async function POST(req) {
  const {userId, userName, name} = await req.json();

  try {
    const db = await createConnection();
    const [nameExist] = await db.query("SELECT * FROM player WHERE gameName = ?", [name]);
    if (nameExist.length > 0) return NextResponse.json({message: "此帳號已被創建"});

    const [result] = await db.query("INSERT INTO player (userId, userName, gameName) VALUES (?, ?, ?)", [userId, userName, name])

    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to: "C3ec2a6b279d579771ca82d451aaf5085",
        messages: [{
          type: 'text',
          text: `${userName} 成功創建帳號 ${name}`
        }]
      })
    })

    return NextResponse.json({message: "成功創建帳號"})

    } catch (error) {
    console.log(`error: ${error}`)
    return NextResponse.json({message: error.message})
  }

  
}

// export async function POST(req) {
//   const {name, userName, userId} = await req.json();
//   console.log(1)
//   const response = await fetch("http://localhost:5000/sheet", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name,userName, userId }),
//   });

//   const data = await response.json();
//   return NextResponse.json({data});
// }