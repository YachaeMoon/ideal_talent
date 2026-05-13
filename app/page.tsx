"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Sparkles, Heart, Download, Share2, ArrowLeft, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import html2canvas from "html2canvas"

const allPhrases = [
  "가능성을 추구한다", "타인의 가능성을 봐준다", "갈등을 풀어가는 능력이 뛰어나다", "감수성이 풍부해서 작은 것에 감탄한다", "아름다움을 느끼고 표현할 줄 안다",
  "기쁨과 슬픔 등의 감정을 잘 표현한다", "기계나 도구를 잘 다룬다", "타인의 비언어적인 표현을 잘 파악한다", "애교가 많다",
  "타인의 사랑을 자연스레 받아들일 줄 안다", "소소한 것들도 잘 기억한다", "요리를 잘 해서 타인들을 잘 섬긴다",
  "개인도 모르는 타인의 강점을 봐준다", "타인의 긍정적인 면을 잘 찾아내어 칭찬한다", "순수해서 어린아이와도 잘 어울리고 놀아준다", "손재주가 좋다",
  "이해관계가 아닌 그 사람 자체를 보려 노력한다", "남들 앞에 나서는 것을 두려워하지 않는다",
  "무례하지 않고 예의바르다", "자발적으로 임한다", "자신에게 잘못한 사람에게 잘못을 만회할 기회를 준다",
  "자신의 재능을 다른 사람과 나누기를 즐긴다", "불의에 대항하여 기꺼이 싸운다", "자신이 책임져야 할 대상들에 대해서는 끝까지 책임진다",
  "자연을 소중히 여기고 보호한다", "동물을 사랑하고 교감하는 능력이 뛰어나다", "조언을 구하러 오는 사람이 많다",
  "자신의 문제를 기꺼이 타인에게 알리고 조언을 구한다", "의로운 분노를 지니고 있다", "특별한 날에 마음이 담긴 선물을 잘 한다",
  "소중한 것을 위해 돈을 아끼지 않는다", "인상이 좋아서 다른 사람들에게 편안함을 준다", "타인의 필요를 정확히 파악하는 능력이 있다",
  "타인과 일을 할 때 기꺼이 협력한다", "나중에 후회할 만한 말이나 행동을 하지 않는다", "솔선수범으로 타인의 마음을 움직인다",
  "모임을 주관하고 대접하는 것을 즐긴다", "낯선 사람들에게도 자신의 연약함을 나눈다", "타인에 대한 무한한 인내심을 갖고 격려할 줄 안다",
  "사건의 전후 관계를 파악하는 능력이 뛰어나다", "타인의 의견과 말에 적극적으로 호응하고 반응한다", "다른 사람과 자신을 비교하지 않는다",
  "다른 사람들에게 선행을 베푸는 일을 즐긴다", "다른 사람들이 자신의 비전에 동참하도록 끌어들이는 능력이 있다", "연약한 자를 보호하려 애쓴다",
  "상대의 감정을 금방 알아채고 그에 맞게 반응할 줄 안다", "다른 사람의 기쁨을 자신의 일처럼 좋아한다",
  "다른 사람들이 능력 이상의 일을 해내도록 격려한다", "불분명한 것을 그냥 지나치지 않는다", "겉과 속이 투명하다",
  "상대에 맞게 상대의 눈높이로 대해준다", "다른 사람의 입장을 헤아릴 줄 안다", "자신과 다른 상대의 의견을 존중하려 노력한다",
  "과거의 것을 문제 삼지 않는다", "자신의 잘못을 변명하지 않는다", "치밀하게 물고 늘어지는 근성이 있다",
  "가까이에 있는 이들의 소중함을 알고 최선을 다한다", "함께 있는 것만으로도 위로가 된다", "모든 사람들에게 똑같은 기회를 준다",
  "단체를 조직하고 관리하는 능력이 뛰어나다", "반복되는 일을 어려워하지 않는다", "새로운 환경에 쉽게 적응한다", "삶에 대한 열정을 타인에게 전염시킨다",
  "세상의 평가에 기죽지 않는다", "기꺼이 자신을 희생한다", "자신의 내면의 소리를 민감하게 파악한다",
  "자신의 잘못을 고치기 위해 적극적이다", "타인의 관심과 사랑에 감사를 잘 표현한다", "언제나 기꺼이 도움을 주려 한다",
  "환경에 압도당하지 않고 그것을 극복하려고 노력한다", "보고 경험한 것에 대한 묘사력이 생생하다", "정보를 찾아내는 능력이 뛰어나다",
  "규칙과 규정을 잘 지킨다", "예견력이 뛰어나다", "일을 할 때 사적인 감정을 조절할 줄 안다", "동정심이 많아 타인을 잘 돕는다",
  "상대방이 어떤 이야기기도 할 수 있을 정도로 수용적이다", "다양한 의견에 개방적이다", "봉사 정신이 투철하다",
  "사람들이 침체되어 있을 때 분위기를 잘 띄운다", "다양한 분야에 관심사를 가지고 삶을 즐긴다", "배울 기회만 있으면 어디든 찾아간다",
  "주변 사람들과 깊은 관계를 맺으려 노력한다", "더 큰 목적을 위해 눈앞의 이익을 절제할 줄 안다", "비조직화된 것을 조직화하는 능력이 있다",
  "개인들의 특징을 잘 찾아낸다", "사람들의 기분을 정확히 간파한다", "사소한 것에서도 무엇인가 새로운 것을 발견할 줄 안다",
  "타인이 상상하지 못하는 것들을 상상한다", "사람들이 자신의 이야기를 꺼내도록 만드는 재주가 있다", "현실을 정확하게 인식하여 합리적인 결정을 내린다",
  "삶을 즐길 줄 안다", "낯선 경험을 두려워하지 않는다", "모두에게 이익이 되는 방법을 잘 찾아낸다",
  "가치 있는 일이라면 실패를 두려워하지 않고 실행에 옮긴다", "관찰력이 뛰어나다", "스스로의 한계를 넘어서기 위해 늘 도전한다", "자신에게 주어진 시간에 의미를 부여한다",
  "신체적으로 강인해서 힘 쓰는 일을 잘 한다", "아무리 큰 시련이 닥쳐도 평정심을 유지한다",
  "자신을 잘 가꾸고 꾸밀 줄 안다", "타인에 대한 긍휼한 마음이 가득하다", "누군가 힘들 때 기꺼이 자신의 시간을 할애한다",
  "말에 힘이 있다", "자신에게 불이익이 돌아오더라도 약속을 반드시 지킨다", "현상을 파악하여 언어로 전달하는 능력이 뛰어나다",
  "열심히 노력하면 좋은 일이 꼭 일어날 것을 믿는다", "옳고 그름에 대한 분별력이 정확하다", "외국인들에게 거리낌 없이 잘 다가간다",
  "운동 신경이 좋아 못하는 스포츠가 없다", "타인을 볼 때 항상 긍정적인 면을 먼저 본다",
  "상황을 정확히 분석하여 신속하게 처리한다", "정확하고 철저해서 남들이 하는 실수를 거의 하지 않는다", "가정적이고 따뜻하다",
  "자기의 생각을 조리 있게 표현할 줄 안다", "작은 것에도 감사할 줄 안다",
  "강철과 같은 의지로 자신이 하는 일을 밀고 나간다", "자신을 낮출 줄 알며 자만하지 않는다", "자신의 감정을 잘 다스린다",
  "자신의 재능과 능력을 개발하기 위해 애쓴다", "정리를 잘한다", "문장력이 탁월하다",
  "위기의 순간에 기지를 발휘해서 문제를 해결한다", "어떠한 상황에서도 밝고 쾌활하다",
  "자신이 하는 일에 헌신적으로 임한다", "늘 웃는 얼굴이어서 보는 이들을 웃게 만든다", "집중력이 뛰어나다",
  "재치 있는 말과 행동으로 분위기를 즐겁게 만든다", "어려운 개념도 쉽게 설명한다", "실제적이다", "양심적이다", "활기가 넘치고 정열적이다",
  "유머 감각이 있다", "의지가 강하다", "의협심이 강하다", "일관성이 있다", "끝을 본다", "근면하다", "자기 주관이 분명하다", "자상하다",
  "자신감이 있다", "기발하다", "검소하다", "분석적이다", "꼼꼼하다", "정의롭다", "정중하다", "정직하다", "조심성이 있다", "진취적이다", "낙관적이다", "사려 깊다", "합리적인 해결책을 모색한다",
  "책임감이 강하다", "청결하다", "충성스럽다", "상대방에 대한 배려가 뛰어나다", "침착하다", "타인에게 신뢰감을 준다", "끼가 많다", "타인의 말을 경청할 줄 안다",
  "현상과 이론에 대한 이해력이 빠르다", "대범하다", "정보를 객관적이고 이성적으로 분별한다", "도전 의식이 강하다", "독창적이다", "뚝심이 있다",
  "리더십이 있다", "멀리 보고 깊이 생각한다", "명랑하다", "신중히 검토하고 행동한다", "고통을 잘 견딘다",
  "누구와도 친근하게 이야기를 나눌 정도로 사교성이 좋다", "모험심이 많다", "새로우면서도 타당한 방법을 찾는다",
  "목표를 향해 힘차게 나아간다", "문제 해결 능력이 뛰어나다", "자신에게 맡겨진 일을 훌륭히 완수해 낸다",
  "공감을 잘한다", "모든 사람들에게 친절하다", "날카로운 통찰력을 지니고 있다", "판단력이 뛰어나다", "포용력이 있다", "지적인 호기심이 많다", "헌신적이다", "느긋하다", "솔직하다",
  "삶의 목적이 뚜렷하다", "순발력이 있다", "자신의 미래를 구체화시키는 능력이 있다", "구성원들이 원만한 관계를 유지하도록 중재한다", "공정하다", "심오하다", "섬세하다",
  "결단력이 있다", "소박하다", "관대하다", "능동적이다", "비합리적인 것을 고치려 노력한다", "사람들을 고무시킨다", "카리스마가 있다", "입이 무거워서 비밀을 잘 지킨다",
  "응용력이 뛰어나다", "기획력이 탁월하다", "자료를 잘 정리한다", "감정이입을 잘한다", "윤곽을 빨리 파악한다", "한결같다", "필요한 곳에 늘 있다", "뒤끝이 없다",
  "유행을 앞서 간다", "사람들에 대한 선입견이 없다", "사람의 이름과 얼굴을 잘 기억한다", "독립심이 강하다", "추리력이 뛰어나다", "직관력이 탁월하다",
  "잔정이 많다", "나서야 할 때와 물러서야 할 때는 정확히 안다", "덕이 있다", "다재다능하다", "수완이 좋다", "붙임성이 있다", "낭만적이다",
  "상식이 풍부하다", "상상을 구체적인 물건으로 만들어 낸다", "삶이 균형 잡혀 있다", "물건을 살 때 흥정을 잘 한다",
  "목가적이다", "자료를 시각화하는 능력이 뛰어나다", "누구도 시도하지 않는 분야를 잘 개척한다", "타인과 소통하기 위해 노력한다", "사람들을 반가이 맞이한다",
  "자신이 소중히 여기는 것들을 타인에게 기꺼이 물려준다", "가르치는데 탁월하다", "도움이 필요한 이들을 훈련시키는데 탁월하다"
]

// Selection Mode Component
function SelectionMode({ 
  onCardCreated 
}: { 
  onCardCreated: (cardId: string) => void 
}) {
  const [selected, setSelected] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const supabase = createClient()

  const togglePhrase = (phrase: string) => {
    if (selected.includes(phrase)) {
      setSelected(selected.filter((s) => s !== phrase))
    } else if (selected.length < 20) {
      setSelected([...selected, phrase])
    }
  }

  const handleCreateCard = async () => {
    if (selected.length === 0) {
      alert("강점을 선택해주세요!")
      return
    }
    
    setIsCreating(true)
    
    try {
      // Insert the card
      const { data: card, error: cardError } = await supabase
        .from("praise_cards")
        .insert({ selected_phrases: selected })
        .select()
        .single()
      
      if (cardError) throw cardError
      
      // Insert phrase likes for each selected phrase
      const phraseLikes = selected.map(phrase => ({
        card_id: card.id,
        phrase,
        like_count: 0
      }))
      
      const { error: likesError } = await supabase
        .from("phrase_likes")
        .insert(phraseLikes)
      
      if (likesError) throw likesError
      
      onCardCreated(card.id)
    } catch (error) {
      console.error("Error creating card:", error)
      alert("카드 생성 중 오류가 발생했습니다.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              <h1 className="text-xl font-bold text-slate-900">칭찬 사전</h1>
            </div>
            <Badge 
              variant={selected.length === 20 ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              {selected.length} / 20 선택됨
            </Badge>
          </div>
          {selected.length > 0 && (
            <div className="mt-3 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${(selected.length / 20) * 100}%` }}
              />
            </div>
          )}
        </div>
      </header>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-center text-slate-600 text-sm">
          나에게 해당하는 강점을 최대 20개까지 선택해주세요
        </p>
      </div>

      {/* Phrase Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-32">
        <div className="flex flex-wrap gap-2 justify-center">
          {allPhrases.map((phrase) => {
            const isSelected = selected.includes(phrase)
            return (
              <button
                key={phrase}
                onClick={() => togglePhrase(phrase)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm
                  transition-all duration-200 ease-out
                  border
                  ${isSelected 
                    ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-200" 
                    : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                  }
                  ${!isSelected && selected.length >= 20 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                disabled={!isSelected && selected.length >= 20}
              >
                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                {phrase}
              </button>
            )
          })}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={handleCreateCard}
            className="w-full h-14 text-lg font-semibold bg-slate-900 hover:bg-slate-800"
            disabled={selected.length === 0 || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                카드 생성 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                카드 발행하기
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  )
}

// Card View Component
function CardView({ 
  cardId, 
  onBack 
}: { 
  cardId: string
  onBack: () => void 
}) {
  const [card, setCard] = useState<{ selected_phrases: string[], created_at: string } | null>(null)
  const [phraseLikes, setPhraseLikes] = useState<Record<string, number>>({})
  const [likedPhrases, setLikedPhrases] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadCard()
    // Load liked phrases from localStorage
    const stored = localStorage.getItem(`liked_${cardId}`)
    if (stored) {
      setLikedPhrases(new Set(JSON.parse(stored)))
    }
  }, [cardId])

  const loadCard = async () => {
    try {
      // Load card data
      const { data: cardData, error: cardError } = await supabase
        .from("praise_cards")
        .select("*")
        .eq("id", cardId)
        .single()
      
      if (cardError) throw cardError
      setCard(cardData)
      
      // Load phrase likes
      const { data: likesData, error: likesError } = await supabase
        .from("phrase_likes")
        .select("phrase, like_count")
        .eq("card_id", cardId)
      
      if (likesError) throw likesError
      
      const likesMap: Record<string, number> = {}
      likesData?.forEach(item => {
        likesMap[item.phrase] = item.like_count
      })
      setPhraseLikes(likesMap)
    } catch (error) {
      console.error("Error loading card:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (phrase: string) => {
    if (likedPhrases.has(phrase)) return // Already liked
    
    const newLiked = new Set(likedPhrases)
    newLiked.add(phrase)
    setLikedPhrases(newLiked)
    localStorage.setItem(`liked_${cardId}`, JSON.stringify([...newLiked]))
    
    // Optimistic update
    setPhraseLikes(prev => ({
      ...prev,
      [phrase]: (prev[phrase] || 0) + 1
    }))
    
    try {
      const { error } = await supabase
        .from("phrase_likes")
        .update({ like_count: (phraseLikes[phrase] || 0) + 1 })
        .eq("card_id", cardId)
        .eq("phrase", phrase)
      
      if (error) throw error
    } catch (error) {
      console.error("Error updating like:", error)
      // Revert on error
      newLiked.delete(phrase)
      setLikedPhrases(newLiked)
      setPhraseLikes(prev => ({
        ...prev,
        [phrase]: (prev[phrase] || 0) - 1
      }))
    }
  }

  const handleDownloadImage = async () => {
    if (!cardRef.current) return
    
    setIsGeneratingImage(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#f8fafc",
        scale: 2,
        useCORS: true,
      })
      
      const link = document.createElement("a")
      link.download = `praise-card-${cardId.slice(0, 8)}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
      alert("이미지 생성 중 오류가 발생했습니다.")
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}?id=${cardId}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "나의 강점 카드 - 칭찬 사전",
          text: "나의 강점을 확인하고 공감해주세요!",
          url,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert("링크가 클립보드에 복사되었습니다!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-slate-600">카드를 찾을 수 없습니다.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          새로운 카드 만들기
        </Button>
      </div>
    )
  }

  const totalLikes = Object.values(phraseLikes).reduce((a, b) => a + b, 0)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">새 카드 만들기</span>
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <span className="text-sm font-medium text-slate-700">
                총 {totalLikes}개의 공감
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Card Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div 
          ref={cardRef}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              <h1 className="text-2xl font-bold text-slate-900">나의 강점 카드</h1>
            </div>
            <p className="text-sm text-slate-500">
              {new Date(card.created_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
          
          {/* Phrases Grid */}
          <div className="flex flex-wrap gap-2 justify-center">
            {card.selected_phrases.map((phrase) => {
              const likes = phraseLikes[phrase] || 0
              const isLiked = likedPhrases.has(phrase)
              
              return (
                <button
                  key={phrase}
                  onClick={() => handleLike(phrase)}
                  className={`
                    group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm
                    transition-all duration-200 ease-out
                    border
                    ${isLiked
                      ? "bg-pink-50 text-pink-700 border-pink-200"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-pink-50 hover:border-pink-200 hover:text-pink-700"
                    }
                  `}
                >
                  <span>{phrase}</span>
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                    ${isLiked ? "bg-pink-200 text-pink-700" : "bg-indigo-200 text-indigo-700 group-hover:bg-pink-200 group-hover:text-pink-700"}
                  `}>
                    <Heart className={`w-3 h-3 ${isLiked ? "fill-current" : ""}`} />
                    {likes}
                  </span>
                </button>
              )
            })}
          </div>
          
          {/* Card Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">칭찬 사전 - Praise Dictionary</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button 
            onClick={handleDownloadImage}
            variant="outline"
            className="flex-1 h-12"
            disabled={isGeneratingImage}
          >
            {isGeneratingImage ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Download className="w-5 h-5 mr-2" />
            )}
            이미지 저장
          </Button>
          <Button 
            onClick={handleShare}
            className="flex-1 h-12 bg-indigo-500 hover:bg-indigo-600"
          >
            <Share2 className="w-5 h-5 mr-2" />
            링크 공유
          </Button>
        </div>
        
        {/* Instructions for viewers */}
        <p className="text-center text-sm text-slate-500 mt-6">
          각 강점을 클릭하여 공감을 표현해주세요
        </p>
      </div>
    </main>
  )
}

// Main Page Component
function PraiseDictionaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cardId, setCardId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      setCardId(id)
    }
  }, [searchParams])

  const handleCardCreated = (id: string) => {
    setCardId(id)
    // Update URL with the card ID
    router.push(`?id=${id}`)
  }

  const handleBack = () => {
    setCardId(null)
    router.push("/")
  }

  if (cardId) {
    return <CardView cardId={cardId} onBack={handleBack} />
  }

  return <SelectionMode onCardCreated={handleCardCreated} />
}

export default function PraiseDictionary() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    }>
      <PraiseDictionaryContent />
    </Suspense>
  )
}
