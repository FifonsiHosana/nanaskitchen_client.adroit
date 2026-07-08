import { useEffect, useState } from "react"
import { useOrderParams } from "../lib/useOrderParams"
import { Input } from "./ui/input"
import {  useRef } from "react"

export const SearchInput = () => {
  const { setParam, params } = useOrderParams()
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setParam("search", e.target.value)
    }, 400)
  }

  return (
    <>
      <Input
        placeholder="Search..."
        className="max-w-28"
        defaultValue={params.search}
        onChange={handleChange}
      />
    </>
  )
}
