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
  const {userId, oldGameName, newGameName} = await req.json();

  try {
    const db = await createConnection();
    const [result] = await db.query("UPDATE player SET gameName = ? Where gameName = ?", [newGameName, oldGameName])

    await db.commit();

    return NextResponse.json({message: "成功更新帳號"})
    } catch (error) {
    console.log(`error: ${error}`)
    return NextResponse.json({message: error.message})
  }
}
