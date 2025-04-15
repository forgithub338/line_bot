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
  const {userId, userName, name} = await req.json();

  try {
    const db = await createConnection();
    const [nameExist] = await db.query("SELECT * FROM player WHERE gameName = ?", [name]);
    if (nameExist.length > 0) return NextResponse.json({message: "此帳號已被創建"});

    const [result] = await db.query("INSERT INTO player (userId, userName, gameName) VALUES (?, ?, ?)", [userId, userName, name])
    return NextResponse.json({message: "成功創建帳號"})
    } catch (error) {
    console.log(`error: ${error}`)
    return NextResponse.json({message: error.message})
  }
}
