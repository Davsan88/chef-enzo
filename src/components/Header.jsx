import React from 'react'
import chefEnzoLogo from '/public/chef-enzo-white.svg'

const Header = () => {
  return (
    <header>
      <img src={chefEnzoLogo} alt="Chef Enzo" />
      <h1>Chef Enzo</h1>
    </header>
  )
}

export default Header
