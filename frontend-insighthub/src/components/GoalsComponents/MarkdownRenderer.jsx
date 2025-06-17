"use client"

const MarkdownRenderer = ({ content }) => {
  const renderMarkdown = (text) => {
    if (!text) return null

    // Split text into lines for processing
    const lines = text.split("\n")
    const elements = []
    let currentList = []
    let listType = null

    const processInlineFormatting = (line) => {
      // Handle bold text **text**
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      // Handle italic text *text*
      line = line.replace(/\*(.*?)\*/g, "<em>$1</em>")

      // Handle inline code `code`
      line = line.replace(
        /`(.*?)`/g,
        '<code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>',
      )

      return line
    }

    const flushList = () => {
      if (currentList.length > 0) {
        const listClass = "space-y-1 ml-4"
        const listItems = currentList.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: processInlineFormatting(item) }} />
          </li>
        ))

        elements.push(
          <ul key={`list-${elements.length}`} className={listClass}>
            {listItems}
          </ul>,
        )
        currentList = []
        listType = null
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      // Skip empty lines
      if (!trimmedLine) {
        flushList()
        elements.push(<br key={`br-${index}`} />)
        return
      }

      // Handle headers
      if (trimmedLine.startsWith("# ")) {
        flushList()
        elements.push(
          <h1 key={index} className="text-lg font-bold text-slate-800 mb-2">
            {trimmedLine.substring(2)}
          </h1>,
        )
        return
      }

      if (trimmedLine.startsWith("## ")) {
        flushList()
        elements.push(
          <h2 key={index} className="text-base font-semibold text-slate-800 mb-2">
            {trimmedLine.substring(3)}
          </h2>,
        )
        return
      }

      if (trimmedLine.startsWith("### ")) {
        flushList()
        elements.push(
          <h3 key={index} className="text-sm font-semibold text-slate-700 mb-1">
            {trimmedLine.substring(4)}
          </h3>,
        )
        return
      }

      // Handle bullet points (*, -, +)
      if (trimmedLine.match(/^[*\-+]\s/)) {
        const content = trimmedLine.substring(2)
        currentList.push(content)
        listType = "bullet"
        return
      }

      // Handle numbered lists
      if (trimmedLine.match(/^\d+\.\s/)) {
        flushList()
        const content = trimmedLine.replace(/^\d+\.\s/, "")
        currentList.push(content)
        listType = "numbered"
        return
      }

      // Handle code blocks
      if (trimmedLine.startsWith("```")) {
        flushList()
        // For now, just treat as regular text
        return
      }

      // Regular paragraph
      flushList()
      elements.push(
        <p key={index} className="text-sm text-slate-800 leading-relaxed mb-2">
          <span dangerouslySetInnerHTML={{ __html: processInlineFormatting(trimmedLine) }} />
        </p>,
      )
    })

    // Flush any remaining list
    flushList()

    return elements
  }

  return <div className="space-y-2">{renderMarkdown(content)}</div>
}

export default MarkdownRenderer
