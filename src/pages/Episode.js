import React, { useCallback, useContext, useEffect, useMemo } from "react"
import { Helmet } from "react-helmet"
import { useHistory, useParams } from "react-router-dom"
import { Box, Card, Heading, Select } from "theme-ui"
import { EpisodeEmptyState } from "../components/EpisodeEmptyState"
import { Loading } from "../components/Loading"
import { SceneLines } from "../components/SceneLines"
import { ScrollToTopButton } from "../components/ScrollToTopButton"
import { Share } from "../components/Share"
import { AppContext } from "../context"
import { useHash } from "../hooks"

export const Episode = React.memo(() => {
  const { data } = useContext(AppContext)
  const episodeData = data?.episodeData

  const history = useHistory()
  const hash = useHash()
  const { id } = useParams()
  const episodeId = id ?? ""

  useEffect(() => {
    if (episodeData == null || hash === "") return
    const el = document.getElementById(hash)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }, [episodeData, hash])

  const episode = useMemo(() => {
    if (episodeData == null || episodeId === "") return
    return episodeData.find((d) => d.id === episodeId)
  }, [episodeData, episodeId])

  const episodeOptions = useMemo(() => {
    if (episodeData == null) return []
    return episodeData.map(toSelectOption)
  }, [episodeData])

  const handleEpisodeChange = useCallback(
    (e) => history.push(`/episode/${e.target.value}`),
    [history]
  )

  if (!episodeData) return <Loading />

  return (
    <Box>
      <Helmet>
        <title>
          Scrantonicity ::{" "}
          {episode == null ? "Episode scripts" : getEpisodeTitle(episode)}
        </title>
      </Helmet>
      <Box mb={4}>
        <Select
          name="episode"
          value={episodeId}
          onChange={handleEpisodeChange}
          autoFocus={episodeId === ""}
        >
          <option value="">Select an episode...</option>
          {episodeOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Box>
      {episode == null ? (
        <EpisodeEmptyState allEpisodes={episodeData} />
      ) : (
        <Box>
          <Heading variant="smDisplay">
            Episode script for ???{episode.title}??? (Season {episode.season},
            Episode {episode.episode})
          </Heading>
          {episode.scenes.map((scene, i) => {
            const sceneId = `scene-${i + 1}`
            const borderColor = hash === sceneId ? "darken" : undefined
            return (
              <Box key={sceneId} id={sceneId} py={1}>
                <Card mb={2} sx={{ position: "relative", borderColor }}>
                  <Box m={1} sx={{ position: "absolute", top: 0, right: 0 }}>
                    <Share
                      hash={sceneId}
                      message={getShareMessage(episode, scene)}
                    />
                  </Box>
                  <SceneLines scene={scene} />
                </Card>
              </Box>
            )
          })}
        </Box>
      )}
      <ScrollToTopButton />
    </Box>
  )
})

function toSelectOption(episodeInfo) {
  const { id, season, episode, title } = episodeInfo
  return {
    value: id,
    label: `S${season}, E${episode} - ${title}`,
  }
}

function getEpisodeTitle(episodeInfo) {
  const { season, episode, title } = episodeInfo
  return `${title} (S${season}, E${episode})`
}

function getShareMessage(episodeInfo, _scene) {
  const { season, episode, title } = episodeInfo
  return `"${title}" (S${season}, E${episode}) from The Office, via Scrantonicity`
}
