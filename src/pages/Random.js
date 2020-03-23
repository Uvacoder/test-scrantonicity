import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Text } from 'theme-ui'
import { Loading } from '../components/Loading'
import { AppContext } from '../context'

export const Random = React.memo(() => {
  const { data } = useContext(AppContext)
  const episodeData = data?.episodeData
  const [scene, setScene] = useState(null)

  useEffect(
    () => {
      if (episodeData == null) return
      setScene(getRandomScene(episodeData))
    },
    [episodeData]
  )

  function handleRefresh() {
    setScene(getRandomScene(episodeData))
  }

  if (!scene) return <Loading />

  const { season, episode, title, lineData } = scene

  return (
    <Box>
      <Box sx={{ mb: 3, p: 2, bg: '#f8f8f8', borderRadius: 5 }}>
        <Box mb={3}>
          {lineData.map(({ speaker, line }, i) => (
            <Box key={i} mb={2}>
              <Text variant="heading">{speaker}</Text>
              <Text>{line}</Text>
            </Box>
          ))}
        </Box>
        <Text sx={{ fontStyle: 'italic', fontSize: 14 }}>
          – {title} (Season {season}, Episode {episode})
        </Text>
      </Box>
      <Button
        sx={{ px: 2, py: 1, bg: 'tomato', fontSize: 12, fontWeight: 'bold' }}
        onClick={handleRefresh}
      >
        Refresh
      </Button>
    </Box>
  )
})

function getRandomScene(episodeData) {
  const randomEpisode = sample(episodeData)
  const { season, episode, title, scenes } = randomEpisode
  const randomScene = sample(scenes)
  return { season, episode, title, lineData: randomScene }
}

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}