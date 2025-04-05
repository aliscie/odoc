import React, { useEffect, useState } from 'react';
import { styled, keyframes } from '@mui/material/styles';
import { Box, Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import ODOCTokenImage from "@/assets/ODOCTOKEN.png";

const sparkle = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(180deg); opacity: 1; }
  100% { transform: scale(0) rotate(360deg); opacity: 0; }
`;

const appear = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 1; }
  30% { transform: scale(0.5) rotate(-5deg); opacity: 0.3; }
  60% { transform: scale(0.8) rotate(2deg); opacity: 0.7; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;

// Add a new animation for the circle growth
const growCircle = keyframes`
  0% { clip-path: polygon(50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%); }
  100% { clip-path: var(--final-clip-path); }
`;

const TrustCircle = styled(Box)(({ theme, score }) => {
  // Determine the final clip path based on score
  const finalClipPath = score === 5 ? 'circle(50%)' : 
                        score >= 4 ? 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 0)' :
                        score >= 3 ? 'polygon(50% 0%, 100% 0%, 100% 75%, 50% 75%, 50% 0)' :
                        score >= 2 ? 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%, 50% 0)' :
                                    'polygon(50% 0%, 100% 0%, 100% 25%, 50% 25%, 50% 0)';
  
  return {
    position: 'relative',
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '--final-clip-path': finalClipPath,
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 'calc(100% + 8px)',
      height: 'calc(100% + 8px)',
      borderRadius: '50%',
      border: `2px solid ${getTrustColor(score)}`,
      boxShadow: `0 0 8px ${getTrustColor(score)}`,
      animation: `${appear} 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), ${growCircle} 1.5s ease-out forwards`,
      clipPath: 'var(--final-clip-path)',
      animationFillMode: 'forwards',
    },
  };
});

const AvatarImage = styled('img')({
  width: 24,
  height: 24,
  borderRadius: '50%',
  objectFit: 'cover',
});

// Custom styled tooltip with premium look
const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgba(33, 33, 33, 0.95)',
    color: '#ffffff',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    padding: theme.spacing(2.5),
    maxWidth: 280,
    fontSize: '0.95rem',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: 'rgba(33, 33, 33, 0.95)',
  },
}));

// Enhanced tooltip content component with reward information
const TooltipContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: '4px 0',
});

const HeaderRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 8,
});

const RewardInfo = styled(Box)({
  marginTop: 8,
  padding: '8px 12px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: 8,
  fontSize: '0.85rem',
});

const RewardRow = styled(Box)(({ theme, active }: { theme?: any, active?: boolean }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '4px 0',
  color: active ? '#4CAF50' : 'inherit',
  fontWeight: active ? 'bold' : 'normal',
}));

const TokenIcon = styled('img')({
  width: 28,
  height: 28,
  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
});

const getTrustColor = (score: number) => {
  if (score >= 4.5) return '#4CAF50'; // Green for high trust
  if (score >= 4) return '#8BC34A'; // Light green
  if (score >= 3.5) return '#FFC107'; // Yellow
  if (score >= 3) return '#FF9800'; // Orange
  return '#F44336'; // Red for low trust
};

interface EnhancedUserAvatarProps {
  actions_rate: number;
  photo: string;
  style?: React.CSSProperties;
}

const EnhancedUserAvatar: React.FC<EnhancedUserAvatarProps> = ({
  actions_rate,
  photo,
  style,
}) => {
  const [imgSrc, setImgSrc] = useState(photo);
  const [imgError, setImgError] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Handle image source changes
  useEffect(() => {
    if (photo) {
      setImgSrc(photo);
      setImgError(false);
    }
  }, [photo]);
  
  // Animate the score from 0 to the actual value
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(actions_rate);
    }, 300); // Small delay before starting animation
    
    return () => clearTimeout(timer);
  }, [actions_rate]);
  
  // Determine which reward tier the user qualifies for
  const getRewardTier = (score: number) => {
    if (score >= 4.5) return { percentage: 0.2, level: 4 };
    if (score >= 4) return { percentage: 0.15, level: 3 };
    if (score >= 3.5) return { percentage: 0.1, level: 2 };
    if (score >= 3) return { percentage: 0.05, level: 1 };
    return { percentage: 0, level: 0 };
  };
  
  const { percentage: userRewardPercentage, level: userLevel } = getRewardTier(actions_rate);
  
  // Get level name
  const getLevelName = (level: number) => {
    switch(level) {
      case 4: return "Platinum";
      case 3: return "Gold";
      case 2: return "Silver";
      case 1: return "Bronze";
      default: return "None";
    }
  };
  
  const handleImageError = () => {
    if (!imgError) {
      setImgSrc('/default-avatar.png');
      setImgError(true);
    }
  };
  
  return (
    <StyledTooltip
      title={
        <TooltipContent>
          <HeaderRow>
            <TokenIcon src={ODOCTokenImage} alt="ODOC Token" />
            <span>ODOC Token Rewards</span>
          </HeaderRow>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Your current trust score:</span> 
            <Box component="span" sx={{ 
              fontWeight: 'bold', 
              backgroundColor: getTrustColor(actions_rate),
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {actions_rate.toFixed(1)}
            </Box>
          </Box>
          
          <Box sx={{ 
            fontStyle: 'italic',
            fontSize: '0.85rem',
            textAlign: 'center',
            padding: '4px 8px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            More transactions sent or received, the more your trust score increases.
          </Box>
          
          <Box sx={{ 
            fontWeight: 'bold', 
            textAlign: 'center',
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            marginTop: '4px'
          }}>
            Current Level: {getLevelName(userLevel)}
          </Box>
          
          <RewardInfo>
            {userLevel > 0 && (
              <RewardRow active={true}>
                <span>Your current reward:</span>
                <span>{userRewardPercentage}% ODOC tokens</span>
              </RewardRow>
            )}
            
            {userLevel < 4 && (
              <>
                <Box sx={{ marginTop: '8px', marginBottom: '4px', opacity: 0.8 }}>
                  Next levels to unlock:
                </Box>
                {userLevel < 2 && (
                  <RewardRow>
                    <span>Trust score 3.5+ (Silver)</span>
                    <span>0.1% ODOC tokens</span>
                  </RewardRow>
                )}
                {userLevel < 3 && (
                  <RewardRow>
                    <span>Trust score 4+ (Gold)</span>
                    <span>0.15% ODOC tokens</span>
                  </RewardRow>
                )}
                {userLevel < 4 && (
                  <RewardRow>
                    <span>Trust score 4.5+ (Platinum)</span>
                    <span>0.2% ODOC tokens</span>
                  </RewardRow>
                )}
              </>
            )}
          </RewardInfo>
          
          {userRewardPercentage > 0 ? (
            <Box sx={{ fontWeight: 'bold', color: '#4CAF50', textAlign: 'center' }}>
              You're earning {userRewardPercentage}% ODOC tokens!
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              Reach trust score 3.0 to start earning ODOC tokens
            </Box>
          )}
        </TooltipContent>
      }
      arrow
      placement="bottom"
    >
      <TrustCircle score={animatedScore}>
        <AvatarImage 
          src={imgSrc} 
          alt="User Avatar" 
          style={style}
          onError={handleImageError}
        />
      </TrustCircle>
    </StyledTooltip>
  );
};

export default EnhancedUserAvatar;