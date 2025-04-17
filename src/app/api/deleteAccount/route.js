import { createConnection } from "@/../lib/connectDB"
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get('userId')

  try {
    const db = await createConnection()
    const [rows] = await db.query("SELECT * FROM player WHERE userId = ?", [userId])

    if (rows.length === 0) {
      return NextResponse.json({ message: "No account found." }, { status: 404 })
    }

    // 回傳所有 gameName（和 userName，如果你需要）
    const data = rows.map(row => ({
      userName: row.userName,
      gameName: row.gameName,
    }))

    return NextResponse.json({
      message: "查詢成功",
      data: data
    })

  } catch (error) {
    console.error(`error: ${error}`)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  const {userName, gameName} = await req.json();

  try {
    const db = await createConnection();
    const [rows] = await db.query("SELECT * FROM player WHERE gameName = ?", [gameName])
    const [result] = await db.query("DELETE FROM player WHERE gameName = ?", [gameName])
    const league = rows[0].league
    const camp = rows[0].camp

    await db.commit();

    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to: "C6fed24600ca5ed14a70c98452b817197",
        messages: [{
          type: 'text',
          text: `${userName} 成功刪除帳號 ${gameName} \n原聯盟：${league} \n原分營：${camp}`
        }]
      })
    })

    return NextResponse.json({message: "成功刪除帳號"})
    } catch (error) {
    console.log(`error: ${error}`)
    return NextResponse.json({message: error.message})
  }
}
